import {
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
} from "@angular/core";

@Directive({
  selector: "[oeventsDynamicAd]",
})
export class DynamicComponentDirective implements OnChanges {
  @Input() adHost: any;
  constructor(public viewRef: ViewContainerRef) {}
  ngOnChanges() {
    this.adHost = this.viewRef;
  }
}
