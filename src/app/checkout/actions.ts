'use server';

interface ShippingRate {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  error?: string;
}

export async function getShippingRates(postalCode: string): Promise<ShippingRate[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    console.error('Melhor Envio token is not configured.');
    // Retornar um erro claro para a interface do usuário
    return [
      { id: 1, name: 'SEDEX', price: '0', delivery_time: 0, error: 'API de frete não configurada.' },
      { id: 2, name: 'PAC', price: '0', delivery_time: 0, error: 'API de frete não configurada.' }
    ];
  }
  
  // CEP de Origem (Exemplo: de um centro de distribuição em São Paulo)
  const fromPostalCode = '01001000';

  const body = {
    from: {
      postal_code: fromPostalCode,
    },
    to: {
      postal_code: postalCode,
    },
    package: {
      // Valores de exemplo para um pacote pequeno
      weight: 0.3, // 300g
      width: 15,
      height: 5,
      length: 20,
    },
    services: "1,2" // 1 para PAC, 2 para SEDEX
  };

  try {
    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Sua Loja (seu-contato@email.com)'
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Melhor Envio API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ShippingRate[] = await response.json();

    // Filtrar e retornar apenas as opções válidas ou com erros específicos
    return data.map(rate => {
      if (rate.error) {
        return { ...rate, name: rate.name || `Serviço ID ${rate.id}`, price: '0', delivery_time: 0 };
      }
      return { ...rate, delivery_time: rate.delivery_time || 0 };
    }).filter(rate => rate.id === 1 || rate.id === 2); // Garante que apenas PAC e SEDEX sejam retornados

  } catch (error) {
    console.error('Failed to fetch shipping rates:', error);
    return [];
  }
}

    