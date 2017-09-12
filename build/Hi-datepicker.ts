import { i18n } from './i18n';
import { Component, ViewContainerRef, OnInit, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from 'moment-jalaali';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HiDatePickerComponent),
  multi: true
};

@Component({
  moduleId: module.id,
  selector: 'hi-datepicker',
  template: `<div [class]="class" [class.hidden]="hiddenButton"><div class="ui-kit-calendar-input" [class.opened]="opened || expanded" (click)="toggle()" [class.hidden]="hiddenButton"><span [class.opened]="opened || expanded">{{ selectedDate.format(viewFormat) }} <img width="25" src="data:image/png;base64,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"></span></div><div class="hpicker-calendar dateIsPicked arrowTop" [class.hasTime]="time" [class.open]="opened" [class.not-raneg]="!hiddenButton"><div class="hpicker-month"><span class="hpicker-prev-month"><img width="15" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cG9seWdvbiBwb2ludHM9IjM1MiwxMjguNCAzMTkuNyw5NiAxNjAsMjU2IDE2MCwyNTYgMTYwLDI1NiAzMTkuNyw0MTYgMzUyLDM4My42IDIyNC43LDI1NiAiLz48L3N2Zz4=" (click)="prevMonth()"></span><div class="hpicker-current-month"><span class="cur-month"><button (click)="aro()" class="aro-btn">{{ i18n.today }}</button> {{ value.format(_formatHeaderCalendar) }}</span><div class="numInputWrapper"><b *ngIf="!isYearEdit" (mouseover)="isYearEdit = true">{{ year }}</b> <input *ngIf="isYearEdit" (mouseleave)="isYearEdit = false" class="numInput cur-year" type="number" [(ngModel)]="year" step="1" onkeydown="return false"></div></div><span class="hpicker-next-month"><img width="15" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cG9seWdvbiBwb2ludHM9IjE2MCwxMjguNCAxOTIuMyw5NiAzNTIsMjU2IDM1MiwyNTYgMzUyLDI1NiAxOTIuMyw0MTYgMTYwLDM4My42IDI4Ny4zLDI1NiAiLz48L3N2Zz4=" (click)="nextMonth()"></span></div><div class="hpicker-innerContainer"><div class="hpicker-rContainer"><div class="hpicker-weekdays" *ngIf="firstWeekdaySaturday"><span class="hpicker-weekday{{isRTL}}">{{ i18n.sat }}</span> <span class="hpicker-weekday{{isRTL}}">{{ i18n.sun }}</span> <span class="hpicker-weekday{{isRTL}}">{{ i18n.mon }}</span> <span class="hpicker-weekday{{isRTL}}">{{ i18n.tue }}</span> <span class="hpicker-weekday{{isRTL}}">{{ i18n.wed }}</span> <span class="hpicker-weekday{{isRTL}}">{{ i18n.thu }}</span> <span class="hpicker-weekday{{isRTL}}" style="color: #ff0000">{{ i18n.fri }}</span></div><div class="hpicker-weekdays {{isRTL}}" *ngIf="!firstWeekdaySaturday"><span class="hpicker-weekday" style="color: #ff0000">{{ i18n.sun }}</span> <span class="hpicker-weekday">{{ i18n.mon }}</span> <span class="hpicker-weekday">{{ i18n.tue }}</span> <span class="hpicker-weekday">{{ i18n.wed }}</span> <span class="hpicker-weekday">{{ i18n.thu }}</span> <span class="hpicker-weekday">{{ i18n.fri }}</span> <span class="hpicker-weekday">{{ i18n.sat }}</span></div><div class="hpicker-days {{isRTL}}"><span class="hpicker-day" *ngFor="let d of days; let i = index;" (mouseup)="selectDate($event, i, d.enabled)" [class.today]="d.today" [class.prevMonthDay]="!d.enabled" [class.selected]="d.selected">{{ d.day }}</span></div></div></div><div class="hpicker-time" *ngIf="time"><div class="numInputWrapper"><input *ngIf="!offAMOrPM" class="numInput hpicker-hour" [(ngModel)]="hour" type="number" pattern="\\d*" tabindex="0" step="1" min="0" max="11"> <input *ngIf="offAMOrPM" class="numInput hpicker-hour" [(ngModel)]="hour" type="number" pattern="\\d*" tabindex="0" step="1" min="0" max="23"></div><span class="arrowUp"></span> <span class="arrowDown"></span> <span class="hpicker-time-separator">:</span><div class="numInputWrapper"><input class="numInput hpicker-minute" [(ngModel)]="minute" type="number" pattern="\\d*" tabindex="0" step="1" min="0" max="59"></div><span class="arrowUp"></span> <span class="arrowDown"></span> <span *ngIf="!offAMOrPM" class="hpicker-am-pm" (mouseup)="AMPM()" tabindex="0">{{ i18n[AMOrPM] }}</span></div></div></div>`,
  styles: [`.ui-kit-calendar-container .ui-kit-calendar-input{border:1px solid #aec9de;border-radius:10px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:70px;height:40px;background:#fcfcff;cursor:pointer;text-align:center;font-size:0;-webkit-transition:all 300ms ease;transition:all 300ms ease}.ui-kit-calendar-container .ui-kit-calendar-input i{color:#505b71;font-size:20px}.ui-kit-calendar-container .ui-kit-calendar-input.opened{width:180px;border:1px solid #44c8f9;color:#44c8f9;background:rgba(68,200,249,.15);font-size:12px}.ui-kit-calendar-container .ui-kit-calendar-input.opened i{color:#44c8f9}.ui-kit-calendar-container .ui-kit-calendar-input span{display:none}.ui-kit-calendar-container .ui-kit-calendar-input span.opened{display:inline;margin-right:10px}.ui-kit-calendar-container.danger .ui-kit-calendar-input.opened{color:#e2747e;background:rgba(226,116,126,.15);border:1px solid #e2747e}.ui-kit-calendar-container.danger .ui-kit-calendar-input.opened i{color:#e2747e}.ui-kit-calendar-container.warning .ui-kit-calendar-input.opened{color:#f4bf4d;background:rgba(244,191,77,.15);border:1px solid #f4bf4d}.ui-kit-calendar-container.warning .ui-kit-calendar-input.opened i{color:#f4bf4d}.ui-kit-calendar-container.success .ui-kit-calendar-input.opened{color:#3fc59d;background:rgba(63,197,157,.15);border:1px solid #3fc59d}.ui-kit-calendar-container.success .ui-kit-calendar-input.opened i{color:#3fc59d}.ui-kit-calendar-container .ui-kit-calendar-input.hidden,.ui-kit-calendar-container.danger .ui-kit-calendar-input.hidden,.ui-kit-calendar-container.success .ui-kit-calendar-input.hidden{display:none}.hpicker-calendar,.hpicker-month{background:0 0;line-height:24px;text-align:center;position:relative}.hpicker-calendar{overflow:hidden;max-height:0;opacity:0;visibility:hidden;padding:0;-webkit-animation:none;animation:none;direction:ltr;border:0;font-size:14px;border-radius:5px;width:293.75px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:top cubic-bezier(0,1,.5,1) 100ms;transition:top cubic-bezier(0,1,.5,1) 100ms;z-index:99999999;background:#fff;-webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08);box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08)}.hpicker-calendar.open{position:absolute}.hpicker-calendar.inline,.hpicker-calendar.open{opacity:1;visibility:visible;overflow:visible;max-height:640px;margin-top:7px}.hpicker-calendar.open{display:inline-block;-webkit-animation:hpickerFadeInDown 300ms cubic-bezier(0,1,.5,1);animation:hpickerFadeInDown 300ms cubic-bezier(0,1,.5,1)}.hpicker-calendar.inline{display:block}.hpicker-calendar.inline,.hpicker-calendar.static{position:relative;top:2px}.hpicker-calendar.static.open{display:block}.hpicker-calendar.hasWeeks{width:auto}.hpicker-calendar.dateIsPicked.hasTime .hpicker-time{height:40px;border-top:1px solid #e6e6e6}.hpicker-calendar.noCalendar.hasTime .hpicker-time{height:auto}.hpicker-calendar:after,.hpicker-calendar:before{position:absolute;display:block;pointer-events:none;border:solid transparent;content:'';height:0;width:0;right:22px}.hpicker-calendar.rightMost:after,.hpicker-calendar.rightMost:before{left:auto;right:22px}.hpicker-calendar:before{border-width:5px;margin:0 -5px}.hpicker-calendar:after{border-width:4px;margin:0 -4px}.hpicker-calendar.arrowTop:after,.hpicker-calendar.arrowTop:before{bottom:100%}.hpicker-calendar.arrowTop:before{border-bottom-color:#e6e6e6}.hpicker-calendar.arrowTop:after{border-bottom-color:#fff}.hpicker-calendar.arrowBottom:after,.hpicker-calendar.arrowBottom:before{top:100%}.hpicker-calendar.arrowBottom:before{border-top-color:#e6e6e6}.hpicker-calendar.arrowBottom:after{border-top-color:#fff}.hpicker-month{color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9);height:28px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.hpicker-next-month,.hpicker-prev-month{text-decoration:none;cursor:pointer;position:absolute;top:10px;height:16px;line-height:16px}.hpicker-next-month i,.hpicker-prev-month i,.numInputWrapper{position:relative}.hpicker-next-month.hpicker-prev-month,.hpicker-prev-month.hpicker-prev-month{left:calc(3.57% - 1.5px)}.hpicker-next-month.hpicker-next-month,.hpicker-prev-month.hpicker-next-month{right:calc(3.57% - 1.5px)}.hpicker-next-month:hover,.hpicker-prev-month:hover{color:#959ea9}.hpicker-next-month:hover svg,.hpicker-prev-month:hover svg{fill:#f64747}.hpicker-next-month svg,.hpicker-prev-month svg{width:14px}.hpicker-next-month svg path,.hpicker-prev-month svg path{-webkit-transition:fill .1s;transition:fill .1s;fill:inherit}.numInputWrapper{height:auto}.numInputWrapper input,.numInputWrapper span{display:inline-block}.numInputWrapper input{width:100%}.numInputWrapper span{position:absolute;right:0;width:14px;padding:0 4px 0 2px;height:50%;line-height:50%;opacity:0;cursor:pointer;border:1px solid rgba(57,57,57,.05);-webkit-box-sizing:border-box;box-sizing:border-box}.numInputWrapper span:hover{background:rgba(0,0,0,.1)}.numInputWrapper span:active{background:rgba(0,0,0,.2)}.numInputWrapper span:after{display:block;content:"";position:absolute;top:33%}.numInputWrapper span.arrowUp{top:0;border-bottom:0}.numInputWrapper span.arrowUp:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid rgba(57,57,57,.6)}.numInputWrapper span.arrowDown{top:50%}.numInputWrapper span.arrowDown:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid rgba(57,57,57,.6)}.numInputWrapper span svg{width:inherit;height:auto}.numInputWrapper span svg path{fill:rgba(0,0,0,.5)}.numInputWrapper:hover{background:rgba(0,0,0,.05)}.numInputWrapper:hover span{opacity:1}.hpicker-current-month{font-size:135%;line-height:inherit;font-weight:300;color:inherit;position:absolute;width:75%;left:12.5%;top:5px;display:inline-block;text-align:center}.hpicker-current-month span.cur-month{font-family:inherit;font-weight:700;color:inherit;display:inline-block;padding-left:7px}.hpicker-current-month .numInputWrapper{width:6ch;width:7ch \\0;display:inline-block}.hpicker-current-month .numInputWrapper span.arrowUp:after{border-bottom-color:rgba(0,0,0,.9)}.hpicker-current-month .numInputWrapper span.arrowDown:after{border-top-color:rgba(0,0,0,.9)}.hpicker-current-month input.cur-year{background:0 0;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;cursor:default;padding:0 0 0 .5ch;margin:0;display:inline;font-size:inherit;font-family:inherit;font-weight:300;line-height:inherit;height:initial;border:0;border-radius:0;vertical-align:initial}.hpicker-current-month input.cur-year:focus{outline:0}.hpicker-current-month input.cur-year[disabled],.hpicker-current-month input.cur-year[disabled]:hover{font-size:100%;color:rgba(0,0,0,.5);background:0 0;pointer-events:none}.hpicker-weekdays{background:0 0;text-align:center;overflow:hidden}.hpicker-weeks{padding:1px 0 0}.hpicker-day,.hpicker-days{-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block}.hpicker-days{padding:0 2.375px;outline:0;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;text-align:left;width:293.75px;-ms-flex-pack:distribute;justify-content:space-around}.hpicker-days.rtl{direction:rtl}.hpicker-day{background:0 0;border:1px solid transparent;border-radius:150px;color:#393939;cursor:pointer;font-weight:400;width:14.2857143%;-ms-flex-preferred-size:14.2857143%;flex-basis:14.2857143%;max-width:38px;height:38px;line-height:38px;margin:0;position:relative;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center}.hpicker-day.inRange,.hpicker-day.nextMonthDay.inRange,.hpicker-day.nextMonthDay.today.inRange,.hpicker-day.nextMonthDay:focus,.hpicker-day.nextMonthDay:hover,.hpicker-day.prevMonthDay.inRange,.hpicker-day.prevMonthDay.today.inRange,.hpicker-day.prevMonthDay:focus,.hpicker-day.prevMonthDay:hover,.hpicker-day.today.inRange,.hpicker-day:focus,.hpicker-day:hover{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.hpicker-day.today{border-color:#959ea9}.hpicker-day.today:focus,.hpicker-day.today:hover{border-color:#959ea9;background:#959ea9;color:#fff}.hpicker-day.endRange,.hpicker-day.endRange.nextMonthDay,.hpicker-day.endRange.prevMonthDay,.hpicker-day.endRange:focus,.hpicker-day.endRange:hover,.hpicker-day.selected,.hpicker-day.selected.nextMonthDay,.hpicker-day.selected.prevMonthDay,.hpicker-day.selected:focus,.hpicker-day.selected:hover,.hpicker-day.startRange,.hpicker-day.startRange.nextMonthDay,.hpicker-day.startRange.prevMonthDay,.hpicker-day.startRange:focus,.hpicker-day.startRange:hover{background:#569ff7;color:#fff;border-color:#569ff7}.hpicker-day.endRange.startRange,.hpicker-day.selected.startRange,.hpicker-day.startRange.startRange{border-radius:50px 0 0 50px}.hpicker-day.endRange.endRange,.hpicker-day.selected.endRange,.hpicker-day.startRange.endRange{border-radius:0 50px 50px 0}.hpicker-day.inRange{border-radius:0;-webkit-box-shadow:-3.75px 0 0 #e6e6e6,3.75px 0 0 #e6e6e6;box-shadow:-3.75px 0 0 #e6e6e6,3.75px 0 0 #e6e6e6}.hpicker-day.disabled,.hpicker-day.disabled:hover{pointer-events:none}.hpicker-day.disabled,.hpicker-day.disabled:hover,.hpicker-day.nextMonthDay,.hpicker-day.notAllowed,.hpicker-day.notAllowed.nextMonthDay,.hpicker-day.notAllowed.prevMonthDay,.hpicker-day.prevMonthDay{color:rgba(57,57,57,.3);background:0 0;border-color:transparent;cursor:default}span.hpicker-weekday{cursor:default;font-size:90%;color:rgba(0,0,0,.54);height:27.166666666666668px;line-height:24px;background:0 0;text-align:center;display:block;float:left;width:14.28%;font-weight:700;margin:0;padding-top:3.166666666666667px}span.hpicker-weekday.rtl{float:right}.rangeMode .hpicker-day{margin-top:1px}.hpicker-weekwrapper{display:inline-block;float:left}.hpicker-weekwrapper .hpicker-weeks{padding:1px 12px 0;-webkit-box-shadow:1px 0 0 #e6e6e6;box-shadow:1px 0 0 #e6e6e6}.hpicker-weekwrapper .hpicker-weekday{float:none;width:100%}.hpicker-weekwrapper span.hpicker-day{display:block;width:100%;max-width:none}.hpicker-innerContainer,.hpicker-rContainer{-webkit-box-sizing:border-box;box-sizing:border-box}.hpicker-innerContainer{display:-webkit-box;display:-ms-flexbox;display:flex;overflow:hidden;display:block}.hpicker-rContainer{display:inline-block;padding:0}.hpicker-time,.hpicker-time input{text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box}.hpicker-time{outline:0;display:block;max-height:40px;overflow:hidden;-webkit-transition:height .33s cubic-bezier(0,1,.5,1);transition:height .33s cubic-bezier(0,1,.5,1);display:-webkit-box;display:-ms-flexbox;display:flex;height:0;line-height:40px}.hpicker-time:after{content:"";display:table;clear:both}.hpicker-time .numInputWrapper{-webkit-box-flex:1;-ms-flex:1;flex:1 1 0%;width:40%;height:40px;float:left}.hpicker-time .numInputWrapper span.arrowUp:after{border-bottom-color:#393939}.hpicker-time .numInputWrapper span.arrowDown:after{border-top-color:#393939}.hpicker-time.hasSeconds .numInputWrapper{width:26%}.hpicker-time.time24hr .numInputWrapper{width:49%}.hpicker-time input{background:0 0;-webkit-box-shadow:none;box-shadow:none;border:0;border-radius:0;margin:0;padding:0;height:inherit;line-height:inherit;cursor:pointer;color:#393939;font-size:14px;position:relative}.hpicker-time input.hpicker-hour{font-weight:700}.hpicker-time input.hpicker-minute,.hpicker-time input.hpicker-second{font-weight:400}.hpicker-time input:focus{outline:0;border:0}.hpicker-time .hpicker-am-pm,.hpicker-time .hpicker-time-separator{height:inherit;display:inline-block;float:left;line-height:inherit;color:#393939;font-weight:700;width:2%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.hpicker-time .hpicker-am-pm{outline:0;width:18%;cursor:pointer;text-align:center;font-weight:400}.hpicker-time .hpicker-am-pm:focus,.hpicker-time .hpicker-am-pm:hover{background:#f0f0f0}.hasTime .hpicker-days,.hasWeeks .hpicker-days{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.hasWeeks .hpicker-days{border-left:0}@media all and (-ms-high-contrast:none){.hpicker-month{padding:0}.hpicker-month svg{top:0!important}}@-webkit-keyframes hpickerFadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:none;transform:none}}@keyframes hpickerFadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:none;transform:none}}.hpicker-calendar.open.not-raneg{position:absolute}.aro-btn{border:1px solid #aec9de;border-radius:10px;height:30px;background:#fcfcff;cursor:pointer;text-align:center;font-family:inherit}.aro-btn:hover{background:#505b71;color:#e6e6e6}`],
  providers: [CALENDAR_VALUE_ACCESSOR]
})

export class HiDatePickerComponent implements ControlValueAccessor, OnInit {

  //====================Input==================
  @Input() class: string;
  @Input() expanded: boolean;
  @Input() opened: boolean;
  @Input() format: string;
  @Input() viewFormat: string;
  @Input() firstWeekdaySaturday: boolean;
  @Input() persianCalendar: boolean;
  @Input() time: boolean;
  @Input() alwaysOpened: boolean;
  @Input() hiddenButton: boolean;
  @Input() offAMOrPM: boolean;
  @Input()
  set minDate(date: HiDate) {
    this._minDate = date;
    this.generateCalendar();
  }
  @Input()
  set maxDate(date: HiDate) {
    this._maxDate = date;
    this.generateCalendar();
  }
  @Input() initTime: any;
  //====================Output==================
  @Output() changeDate = new EventEmitter();
  //============================================
  public _date: any = moment();
  public _selectedDate: any = moment();
  public el: Element;
  public timeData = { hour: 10, minute: 20 };
  public days: HiDatePicker[] = [];
  public _formatHeaderCalendar: string;
  public type: string = "Gregorian";
  public isRTL: string;
  public isYearEdit: boolean = false;
  public AMOrPM: string = "am";
  public _minDate: HiDate;
  public _maxDate: HiDate;
  public i18n: any;
  private i18nObj = {
    en: {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",
      am: "AM",
      pm: "PM",
      today: "today"
    },
    fa: {
      mon: "دوشنبه",
      tue: "سه شنبه",
      wed: "چهارشنبه",
      thu: "پنج شنبه",
      fri: "جمعه",
      sat: "شنبه",
      sun: "یک شنبه",
      am: "ق.ظ",
      pm: "ب.ظ",
      today: "امروز"
    }
  };

  constructor(viewContainerRef: ViewContainerRef) {
    this.el = viewContainerRef.element.nativeElement;
  }

  ngOnInit() {
    this.selectedDate = moment();
    let currentTime = { hour : this.selectedDate.hour(), minute: this.selectedDate.minute()};
    this.timeData = this.initTime || currentTime;
    this._maxDate = this._maxDate || { day: 0, month: 0, year: 0 };
    this._minDate = this._minDate || { day: 0, month: 0, year: 0 };
    this.i18n = this.i18nObj.en;
    this.persianCalendar = this.persianCalendar || false;
    this.time = this.time || false;
    this.alwaysOpened = this.alwaysOpened || false;
    this.offAMOrPM = this.offAMOrPM || false;
    if (this.alwaysOpened) this.opened = true;
    if (this.persianCalendar) {
      this.i18n = this.i18nObj.fa;
      this.type = "Solar";
      this.firstWeekdaySaturday = this.firstWeekdaySaturday || true;
    }
    else {
      this.type = "Gregorian";
      this.firstWeekdaySaturday = this.firstWeekdaySaturday || false;
    }
    switch (this.type) {
      case "Solar":
        moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
        this._formatHeaderCalendar = 'jMMMM';
        this.format = this.format || 'x';
        this.viewFormat = this.viewFormat || ((this.time) ? 'jD jMMMM jYYYY h:m a' : 'jD jMMMM jYYYY');
        this.isRTL = " rtl";
        break;
      default:
        moment.locale('en');
        this._formatHeaderCalendar = 'MMMM';
        this.format = this.format || 'x';
        this.viewFormat = this.viewFormat || (this.time) ? 'D MMMM YYYY hh:mm a' : 'D MMMM YYYY';
        this.isRTL = "";
        break;
    }
    this.class = `ui-kit-calendar-container ${this.class}`;
    this.opened = this.opened || false;
    this.selectedDate = moment();
    this.value = moment()
    this.generateCalendar();

    // closed date-picker click page
    let body = document.querySelector('body');
    body.addEventListener('click', e => {
      if (!this.opened || !e.target) {
        return;
      }
      if (this.el !== e.target && !this.el.contains((<any>e.target))) {
        this.close();
      }
    }, false);
  }

  get value(): any {
    return this._date;
  }

  set value(value: any) {
    this._date = value;
  }

  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(value: any) {
    this._selectedDate = value;
    this.onChange(this._selectedDate.format(this.format));
  }

  get year() {
    switch (this.type) {
      case "Solar":
        return this.value.jYear();
      default:
        return this.value.year();
    }
  }

  set year(year: number) {
    switch (this.type) {
      case "Solar":
        if (this.value.jYear() > year)
          this.subtract(this.value.jYear() - year, 'jYear');
        else if (this.value.jYear() < year) {
          this.add(year - this.value.jYear(), 'jYear');
        }
        break;
      default:
        if (this.value.year() > year)
          this.subtract(this.value.year() - year, 'year');
        else if (this.value.year() < year) {
          this.add(year - this.value.year(), 'year');
        }
        break;
    }
    this.generateCalendar();
  }

  subtract(count: number, type: string): void {
    this.value = this.value.subtract(count, type);
    this.generateCalendar();
  }

  add(count: number, type: string): void {
    this.value = this.value.add(count, type);
    this.generateCalendar();
  }

  get hour() {
    if (!this.offAMOrPM) {

      if (this.timeData.hour < 13) {
        this.AMOrPM = 'am';
        return this.timeData.hour;
      }
      else {
        this.AMOrPM = 'pm';
        return this.timeData.hour - 12;
      }
    } else {
      if (this.timeData.hour >= 0 && this.timeData.hour < 12)
        this.AMOrPM = 'am';
      else
        this.AMOrPM = 'pm';
      return this.timeData.hour;
    }
  }

  set hour(hour: number) {
    if (!this.offAMOrPM) {
      if (hour >= 0 && hour < 12) {
        if (this.AMOrPM == 'am')
          this.timeData.hour = hour;
        else
          this.timeData.hour = hour + 12;
        this.changeTime();
      }
    } else {
      if (hour >= 0 && hour < 12)
        this.AMOrPM = 'am';
      else
        this.AMOrPM = 'pm';
      this.timeData.hour = hour;
      this.changeTime();
    }
  }

  get minute() {
    return this.timeData.minute;
  }

  set minute(minute: number) {
    if (minute >= 0 && minute < 60) {
      this.timeData.minute = minute;
      this.changeTime();
    }
  }

  changeTime(): void {
    let currentDay: any = this.days.filter(day => {
      if (day.selected == true) return true;
    })[0];
    if (currentDay == undefined) currentDay = this.days.filter(day => {
      if (day.today == true) return true;
    })[0];
    if (currentDay == undefined) {
      switch (this.type) {
        case "Solar":
          currentDay = {
            day: this.selectedDate.jDate(),
            month: this.selectedDate.jMonth(),
            year: this.selectedDate.jYear()
          };
          break;
        case "Gregorian":
          currentDay = {
            day: this.selectedDate.date(),
            month: this.selectedDate.month(),
            year: this.selectedDate.year()
          };
          break;
      }

    }
    let selectedDate = moment();
    switch (this.type) {
      case "Solar":
        selectedDate = moment(`${currentDay.day}.${currentDay.month}.${currentDay.year} ${this.timeData.hour}:${this.timeData.minute}`, 'jDD.jMM.jYYYY HH:mm');
        break;
      case "Gregorian":
        selectedDate = moment(`${currentDay.day}.${currentDay.month}.${currentDay.year} ${this.timeData.hour}:${this.timeData.minute}`, 'DD.MM.YYYY HH:mm');
        break;
    }
    this.selectedDate = selectedDate;
  }

  generateCalendar() {
    switch (this.type) {
      case "Solar":
        this.jalaliGenerateCalendar();
        break;
      case "Gregorian":
        this.miladiGenerateCalendar();
        break;
      default:
        this.miladiGenerateCalendar();
    }
  }

  jalaliGenerateCalendar() {
    let date = moment(this._date);
    let month = date.jMonth();
    let year = date.jYear();
    let n: number = 1;
    let firstWeekDay = date.jDate(1).day();
    let lastDayMonth = moment.jDaysInMonth(year, month);

    if (this.firstWeekdaySaturday) {
      n = ((firstWeekDay + 6) % 6) * -1;
    } else {
      n = (((firstWeekDay + 6) % 6) - 2) * -1;
    }
    let dd = (lastDayMonth + (Math.abs(n) + 1)) % 7;
    let dayInit = dd > 0 ? lastDayMonth + (7 - dd) : lastDayMonth;


    this.days = [];
    for (let i = n; i <= dayInit; i += 1) {
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'jDD.jMM.jYYYY');
      let today = (moment().isSame(currentDate, 'day') && moment().isSame(currentDate, 'month')) ? true : false;
      let selected: boolean = (this.selectedDate && this.selectedDate.isSame(currentDate, 'day')) ? true : false;

      if (i > 0 && i <= lastDayMonth) {
        this.days.push(this.checkValidDate({
          day: i,
          month: month + 1,
          year: year,
          enabled: true,
          today: today,
          selected: selected
        }));
      } else {
        this.days.push({
          day: null,
          month: null,
          year: null,
          enabled: false,
          today: false,
          selected: false
        });
      }
    }
  }

  checkValidDate(d: HiDatePicker): HiDatePicker {
    if (this.checkChecker(this._maxDate) && this.checkChecker(this._minDate)) {
      if (this.validMinDate(d) && this.validMaxDate(d)) return d;
      else {
        d.enabled = false;
        return d;
      }

    } else if (this.checkChecker(this._minDate)) {
      if (this.validMinDate(d)) return d;
      else {
        d.enabled = false;
        return d;
      }

    } else if (this.checkChecker(this._maxDate)) {
      if (this.validMaxDate(d)) return d;
      else {
        d.enabled = false;
        return d;
      }
    }
    return d;
  }

  checkChecker(d: HiDate): boolean {
    if (d.year == 0 && d.month == 0 && d.day == 0) return false;
    return true;
  }

  validMaxDate(d: HiDatePicker): boolean {
    if (d.year < this._maxDate.year) return true;
    else if (d.year == this._maxDate.year && d.month < this._maxDate.month) return true;
    else if (d.year == this._maxDate.year && d.month == this._maxDate.month && d.day <= this._maxDate.day) return true;
    else false;
  }

  validMinDate(d: HiDatePicker): boolean {
    if (d.year > this._minDate.year) return true;
    else if (d.year == this._minDate.year && d.month > this._minDate.month) return true;
    else if (d.year == this._minDate.year && d.month == this._minDate.month && d.day >= this._minDate.day) return true;
    else false;
  }

  miladiGenerateCalendar() {
    let date = moment(this._date);
    let month = date.month();
    let year = date.year();
    let n: number = 1;
    let firstWeekDay = date.date(1).day() as number;
    let lastDayMonth = date.daysInMonth();

    n = (firstWeekDay - 1) * -1;

    let dayInit = lastDayMonth + Math.abs(n);

    this.days = [];
    for (let i = n; i <= dayInit; i += 1) {
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      let today = (moment().isSame(currentDate, 'day') && moment().isSame(currentDate, 'month')) ? true : false;
      let diff = this.selectedDate.diff(currentDate, 'day');
      let selected = (diff == 0) ? true : false;

      if (i > 0 && i <= lastDayMonth) {
        this.days.push({
          day: i,
          month: month + 1,
          year: year,
          enabled: true,
          today: today,
          selected: selected
        });
      } else {
        this.days.push({
          day: null,
          month: null,
          year: null,
          enabled: false,
          today: false,
          selected: selected
        });
      }
    }
  }

  selectDate(e: MouseEvent, i: number, enabled: boolean) {
    if (enabled) {
      e.preventDefault();
      let date: HiDatePicker = this.days[i];
      let selectedDate = moment();
      switch (this.type) {
        case "Solar":
          if (this.time)
            selectedDate = moment(`${date.day}.${date.month}.${date.year} ${this.timeData.hour}:${this.timeData.minute}`, 'jDD.jMM.jYYYY HH:mm');
          else
            selectedDate = moment(`${date.day}.${date.month}.${date.year}`, 'jDD.jMM.jYYYY');
          break;
        case "Gregorian":
          if (this.time)
            selectedDate = moment(`${date.day}.${date.month}.${date.year} ${this.timeData.hour}:${this.timeData.minute}`, 'DD.MM.YYYY HH:mm');
          else
            selectedDate = moment(`${date.day}.${date.month}.${date.year}`, 'DD.MM.YYYY');
          break;
      }
      this.selectedDate = selectedDate;
      this.changeDate.emit(this.value);
      this.close();
      this.generateCalendar();
    }
  }

  prevMonth() {
    switch (this.type) {
      case "Solar":
        this.value = this.value.add(1, 'jMonth');
        this.generateCalendar();
        break;
      default:
        this.value = this.value.subtract(1, 'month');
        this.generateCalendar();
        break;
    }
  }

  nextMonth() {
    switch (this.type) {
      case "Solar":
        this.value = this.value.subtract(1, 'jMonth');
        this.generateCalendar();
        break;
      default:
        this.value = this.value.add(1, 'month');
        this.generateCalendar();
        break;
    }
  }

  writeValue(value: any) {
    if (value != null || value != undefined || (this.format == "x" || this.format == "X") ? moment(parseInt(value)).isValid() : moment(value, this.format).isValid()) {
      this.selectedDate = (this.format == "x" || this.format == "X") ? moment(parseInt(value)) : moment(value, this.format);
      this.value = (this.format == "x" || this.format == "X") ? moment(parseInt(value)) : moment(value, this.format);
    } else if (value == null || value == undefined) {
      this.selectedDate = moment();
      this.value = moment();
    }
  }

  registerOnChange(fn: (value: any) => any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this.onTouched = fn;
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  toggle() {
    if (!this.alwaysOpened)
      this.opened = !this.opened;
  }

  open() {
    this.opened = true;
  }

  close() {
    if (!this.alwaysOpened)
      this.opened = false;
  }

  AMPM() {
    if (this.AMOrPM == 'am') {
      this.AMOrPM = 'pm';
      this.timeData.hour = this.timeData.hour + 12;
    }
    else {
      this.AMOrPM = 'am';
      this.timeData.hour = this.timeData.hour - 12;
    }
    this.changeTime();
  }

  aro() : void {
    this.selectedDate = moment();
    this.value = this.selectedDate;
    this.changeDate.emit(this.value);
    this.close();
    this.generateCalendar();
  }
}
