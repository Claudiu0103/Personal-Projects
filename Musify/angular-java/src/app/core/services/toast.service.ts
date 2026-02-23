import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastType } from '../models/enums/toast-type.enum';

export interface Toast {
    message: string;
    type: ToastType;
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    private readonly defaultDuration = 3000;
    toasts$ = this.toastsSubject.asObservable();

    private show(toast: Toast) {
        const current = this.toastsSubject.getValue();
        this.toastsSubject.next([...current, toast]);

        setTimeout(() => this.remove(toast), toast.duration ?? 3000);
    }

    showSuccess(message: string) {
        this.show({
            message: message,
            type: ToastType.Success,
            duration: this.defaultDuration
        })
    }

    showError(message: string) {
        this.show({
            message: message,
            type: ToastType.Error,
            duration: this.defaultDuration
        })
    }

    showInfo(message: string) {
        this.show({
            message: message,
            type: ToastType.Info,
            duration: this.defaultDuration
        })
    }

    showWarning(message: string) {
        this.show({
            message: message,
            type: ToastType.Warning,
            duration: this.defaultDuration
        })
    }

    remove(toast: Toast) {
        this.toastsSubject.next(this.toastsSubject.getValue().filter(t => t !== toast));
    }
}