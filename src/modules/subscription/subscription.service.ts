import Stripe from "stripe";
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
};

const handleWebhook = async(payload: Buffer, signature: string)=>{
    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );
console.log(event.data.object,"outside of switch case")
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
        // console.log(event.data.object,"switch case ----")
        await handleCheckoutCompleted(event.data.object)
        
        break;
        case 'customer.subscription.updated':



        break;
        case 'customer.subscription.deleted':



        break;
        default:
        // Unexpected event type
        console.log(`No event matched Unhandled event type ${event.type}.`);
        break;
    }
}
const getPeriodEnd = (payload:Stripe.Subscription) =>{
    // const currentPeriodStart = stripeSubscription.items.data[0]?.current_period_start;
        const currentPeriodEndInMiliseconds = payload.items.data[0]?.current_period_end!;

        const currentPeriodEnd = new Date(currentPeriodEndInMiliseconds * 1000)
        console.log( "current period End:-------",currentPeriodEnd);
        
        return currentPeriodEnd;
}
const handleCheckoutCompleted = async(session: Stripe.Checkout.Session)=>{

        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if(!userId || !stripeSubscriptionId || !stripeCustomerId){

            throw new Error("Webhook Failed")
        }
       
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        
        console.log("sub info :", stripeSubscription.items.data[0]);

        const currentPeriodEnd = getPeriodEnd(stripeSubscription);

        await prisma.subscription.upsert({
            where:{
                userId,
            },
            create:{
                userId,
                stripeCustomerId,
                stripeSubscriptionId,
                status:"ACTIVE",
                currentPeriodEnd,  
            },
            update:{
                stripeCustomerId,
                stripeSubscriptionId,
                status:"ACTIVE",
                currentPeriodEnd,
            }
        })
}

export const subscriptionServices = {
    createCheckoutSession,
    handleWebhook,
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
