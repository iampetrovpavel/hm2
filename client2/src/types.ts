export interface VoiceTranscription {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface DataChannelMessage {
    type: string;
    content?: string;
    role?: string;
    [key: string]: any;
}

export type ProjectData = {
    project_details: {
        project_description: {
            description: string;
            job_info: string | null;
            job_owner: string;
            job_type: string | null;
            large_hills_or_slopes: string | null;
        };
        area_of_project: {
            length: string;
            width: string;
            depth: string;
        };
    };
    location: {
        address: string;
        start_date: string;
        end_date: string | null;
        time_slots: string | null;
        truck_spacing: string;
        delivery_rate: string | null;
        other_info: string | null;
        products: {
            id: string | null;
            name: string;
            qty: number;
            uom: string;
            product_specific_comments: string | null;
        }[];
    }[];
    contact_info: {
        name: string | null;
        phone: string;
        email: string | null;
    };
    comments: string | null;
    completed: boolean;
};