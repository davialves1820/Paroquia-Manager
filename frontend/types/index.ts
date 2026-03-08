export interface CatechismClass {
    id: number;
    name: string;
    year: number;
    catechistId: number;
}

export interface Student {
    id: number;
    name: string;
    hasBaptism: boolean;
    hasFirstEucharist: boolean;
    status: string;
    frequency?: number;
}

export interface StudentMissingSacraments {
    id: number;
    name: string;
    hasBaptism: boolean;
    hasFirstEucharist: boolean;
    catechismClass: {
        name: string;
    };
}

export interface CatechismMetrics {
    totalStudents: number;
    completionRate: number;
    activeClasses: number;
}

export interface Attendance {
    id: number;
    studentId: number;
    date: string;
    isPresent: boolean;
    hasMeeting?: boolean;
}

export interface ClassDetails {
    id: number;
    name: string;
    year: number;
    catechistId: number;
    students: Student[];
    attendances: Attendance[];
}
