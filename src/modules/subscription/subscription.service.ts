import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSession = async(userId: string) =>{
    const transactionResult = await prisma.$transaction(async(tx)=>{
        const user = await tx.user.findUniqueOrThrow({
            where:{
                id:userId
            },
            include:{
                subscription:true
            }
            
        })
        let stripeCustomerId = user.subscription?.stripeCustomerId;

        if(!stripeCustomerId){
            // new subscriber
            const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata:{userId: user.id}
        })
        stripeCustomerId = customer.id
        }

       const session = await stripe.checkout.sessions.create({
    line_items: [
        {
            price: config.stripe_product_price_id,
            quantity: 1,
        },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    success_url: `${config.app_url}/premium?success=true`,
    cancel_url: `${config.app_url}/payment?success=false`,
    metadata: { userId: user.id },
    subscription_data: {
        metadata: { userId: user.id }, // এটা Subscription object-এও metadata কপি করবে
    },
});

if (!session.url) {
    throw new Error("Stripe checkout URL তৈরি করা যায়নি");
}

return session.url;
        

    });
    return {
        paymentUrl : transactionResult
    }
}
export const subscriptionServices = {
    createCheckoutSession
}




// import config from "../../config"
// import { prisma } from "../../lib/prisma"
// import { stripe } from "../../lib/stripe"

// const createCheckoutSession = async(userId: string) =>{
//     const transactionResult = await prisma.$transaction(async(tx)=>{
//         const user = await tx.user.findUniqueOrThrow({
//             where:{
//                 id:userId
//             },
//             include:{
//                 subscription:true
//             }
            
//         })
//         let stripeCustomerId = user.subscription?.stripeCustomerId;

//         if(!stripeCustomerId){
//             // new subscriber
//             const customer = await stripe.customers.create({
//             email: user.email,
//             name: user.name,
//             metadata:{userId: user.id}
//         })
//         stripeCustomerId = customer.id
//         }

//         const session = await stripe.checkout.sessions.create({
//             line_items:[
//                 {
//                     price: config.stripe_product_price_id,
//                     quantity:1
//                 }
//             ],
//             mode:"subscription",
//             customer:stripeCustomerId,
//             payment_method_types:["card"],
//             success_url:`${config.app_url}/premium?success=true`,
//             cancel_url:`${config.app_url}/payment?success=false`,
//             metadata:{userId: user.id}
//         });
     
//         return session.url
        

//     });
//     return {
//         paymentUrl : transactionResult
//     }
// }
// export const subscriptionServices = {
//     createCheckoutSession
// }
