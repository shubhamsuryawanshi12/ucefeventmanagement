export type UserRole = 'student' | 'organizer' | 'admin';
export type EventStage = 'draft' | 'published' | 'registration_open' | 'ongoing' | 'completed' | 'archived';
export type EventType = 'workshop' | 'hackathon' | 'seminar' | 'cultural' | 'sports' | 'tech_talk' | 'other';
export type ParticipationStatus = 'registered' | 'attended' | 'contributed' | 'certified';
export type AttendanceMethod = 'qr' | 'manual' | 'code' | 'gps';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
    department?: string;
    student_id?: string;
    phone?: string;
    bio?: string;
    is_verified: boolean;
    total_events_attended: number;
    total_contribution_score: number;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    event_type: EventType;
    stage: EventStage;
    organizer_id: string;
    venue?: string;
    capacity?: number;
    registration_count: number;
    start_date: string;
    end_date: string;
    registration_deadline?: string;
    attendance_method: AttendanceMethod;
    attendance_code?: string;
    banner_url?: string;
    tags?: string[];
    requirements?: string;
    created_at: string;
    updated_at: string;
}

export interface Participation {
    id: string;
    student_id: string;
    event_id: string;
    status: ParticipationStatus;
    registered_at: string;
    attended_at?: string;
    contributed_at?: string;
    certified_at?: string;
    contribution_score: number;
    verification_status: boolean;
    certificate_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Contribution {
    id: string;
    participation_id: string;
    title: string;
    description?: string;
    submission_url?: string;
    file_url?: string;
    score: number;
    feedback?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface EventTask {
    id: string;
    event_id: string;
    title: string;
    description?: string;
    task_type: string;
    required: boolean;
    max_score: number;
    deadline?: string;
    created_at: string;
}

export interface Certificate {
    id: string;
    participation_id: string;
    certificate_number: string;
    issued_at: string;
    issued_by: string;
    template_type: string;
    pdf_url?: string;
    is_valid: boolean;
    created_at: string;
}
