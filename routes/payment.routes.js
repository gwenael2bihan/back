module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            'Access-Control-Allow-Origin', '*',
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/create-checkout-session', async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'T-shirt',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
        });

        res.redirect(303, session.url);
    });

    app.post('/api/charge', async (req, res) => {
        const { id, amount } = req.body;
        console.log("Payment: " + amount);
        try {
            const payment = await stripe.paymentIntents.create({
                amount,
                currency: 'EUR',
                description: 'pomme',
                payment_method: id,
                confirm: true
            });
            console.log(payment);
            return res.status(200).json({ confirm: '1232' })

        } catch (err) {

        }
    });
}