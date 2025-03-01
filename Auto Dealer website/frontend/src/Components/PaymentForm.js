import React, { useState } from 'react';

function PaymentForm({ onSubmit }) {
    const [shippingAddress, setShippingAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const paymentDetails = {
            shippingAddress,
            cardNumber,
            expiryDate,
            cvv,
            cardHolderName,
        };
        onSubmit(paymentDetails);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Detalii Plată</h2>
            <label>
                Adresa de livrare:
                <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Numărul cardului:
                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={16}
                    required
                />
            </label>
            <br />
            <label>
                Data expirării:
                <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                CVV:
                <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                    required
                />
            </label>
            <br />
            <label>
                Numele deținătorului cardului:
                <input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit">Finalizează Comanda</button>
        </form>
    );
}

export default PaymentForm;
