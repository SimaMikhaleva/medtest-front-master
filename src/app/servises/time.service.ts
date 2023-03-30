import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor() { }

    static formatDate(date: any) {
        let ddate = new Date(date);
        
        let dayOfMonth = ddate.getDate();
        let month = ddate.getMonth() + 1;
        let year = ddate.getFullYear();
        let hour = ddate.getHours();
        let minutes = ddate.getMinutes();

        let diffMs = Date.now() - ddate.getTime();
        let diffSec = Math.round(diffMs / 1000);
        let diffMin = Math.round(diffSec / 60);
        let diffHour = Math.round(diffMin / 60);
        let diffDay = Math.round(diffHour / 24);
    
        let dyear = year.toString().slice(-2);
        let dmonth = month < 10 ? '0' + month : month;
        let ddayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
        let dhour = hour < 10 ? '0' + hour : hour;
        let dminutes = minutes < 10 ? '0' + minutes : minutes;

        if (diffSec < 1) {
            return 'Только что';
        } else if (diffMin < 1) {
            let scs = "секунды";
            if ([5,6,7,8,9,
                10,11,12,13,14,15,16,17,18,19,
                20,25,26,27,28,29,
                30,35,36,37,38,39,
                40,45,46,47,48,49,
                50,55,56,57,58,59,60].includes(diffSec)) {
                scs = "секунд";
            } else if ([1,21,31,41,51].includes(diffSec)) {
                scs = "секунда";
            }
            return `${diffSec} ${scs} назад`
        } else if (diffHour < 1) {
            let mns = "минуты";
            if ([5,6,7,8,9,
                10,11,12,13,14,15,16,17,18,19,
                20,25,26,27,28,29,
                30,35,36,37,38,39,
                40,45,46,47,48,49,
                50,55,56,57,58,59,60].includes(diffMin)) {
                mns = "минут";
            } else if ([1,21,31,41,51].includes(diffMin)) {
                mns = "минута";
            }
            return `${diffMin} ${mns} назад`
        } else if (diffDay < 1) {
            let hrs = "час";
            if ([2,3,4,22,23,24].includes(diffHour)) {
                hrs = "часа";
            } else if ([5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].includes(diffHour)) {
                hrs = "часов";
            }
            return `${diffHour} ${hrs} назад`
        } else {
            return `${ddayOfMonth}.${dmonth}.${dyear} ${dhour}:${dminutes}`
        }
    }
}