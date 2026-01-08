'use server';

import { MercadoPagoConfig, Payment } from 'mercadopago';

interface Payer {
    email: string;
}

interface PaymentData {
    transaction_amount: number;
    description: string;
    payer: Payer;
}

interface PaymentResponse {
    success: boolean;
    qrCode?: string;
    qrCodeBase64?: string;
    error?: string;
}

export async function createPixPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
        console.error("Mercado Pago Access Token is not configured.");
        return { success: false, error: 'A API de pagamentos não está configurada corretamente.' };
    }

    try {
        const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000 } });
        const payment = new Payment(client);

        const response = await payment.create({
            body: {
                transaction_amount: paymentData.transaction_amount,
                description: paymentData.description,
                payment_method_id: 'pix',
                payer: {
                    email: paymentData.payer.email,
                }
            }
        });
        
        const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
        const qrCodeBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64;

        if (qrCode && qrCodeBase64) {
             return {
                success: true,
                qrCode: qrCode,
                qrCodeBase64: qrCodeBase64,
            };
        } else {
            console.error("Mercado Pago API response missing QR code data.", response);
            return { success: false, error: 'Não foi possível obter os dados do QR Code do PIX.' };
        }

    } catch (error: any) {
        console.error('Error creating Mercado Pago PIX payment:', error);
        return { 
            success: false, 
            error: error.cause?.message || 'Ocorreu um erro ao se comunicar com o provedor de pagamento.' 
        };
    }
}
