export interface CustomerInfo {
    name: string;
    surname: string;
    phone_number: string;
    email: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip_code: string;
}

export interface PurchaseResponse {
    success: boolean;
    data: {
        transaction_id: string;
        payment_url: string;
    };
    message?: string;
}

export interface PurchaseDetails {
    _id: string;
    user_id: string;
    book_id: string;
    price: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_id: string;
    customer_info: CustomerInfo;
    purchased_at: string;
    book: {
        _id: string;
        title: string;
        author: string;
        coverImage: string;
    };
} 