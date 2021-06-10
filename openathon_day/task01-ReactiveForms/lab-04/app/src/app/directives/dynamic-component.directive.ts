import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[oeventsDynamicAd]",
})
export class DynamicComponentDirective {
  constructor(public viewRef: ViewContainerRef) {}
}
