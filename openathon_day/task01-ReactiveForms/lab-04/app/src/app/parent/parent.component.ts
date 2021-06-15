import {
  Component,
  OnInit,
  KeyValueDiffers,
  KeyValueDiffer,
  KeyValueChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { initializeUser, User } from "../models/user.model";

type Mutable = {
  -readonly [K in keyof any]: any[K];
};

@Component({
  selector: "oevents-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.scss"],
})
export class ParentComponent implements OnInit {
  @ViewChild("childTemplate") child: any;
  constructor(private differs: KeyValueDiffers) {}
  userClone: Mutable = initializeUser();
  differ: KeyValueDiffer<any, any>;
  ngOnInit(): void {
    this.differ = this.differs.find(this.userClone).create();
    console.log(this.differ);
  }

  printEvent(event: User) {
    // this.userClone = event;
    this.userClone = Object.assign({}, event);
    this.userClone = Object.assign(this.userClone, { newKey: "" });
    this.userClone = Object.defineProperty(this.userClone, "id_new", {
      value: 2,
    });
    this.userClone.name = "name2";
    let clone: Mutable = Object.assign({}, this.userClone);
    clone.id_new = 3;
    console.log(clone);
    const changeUser: KeyValueChanges<any, any> = this.differ.diff(
      this.userClone
    );
    event.name = "name1";
    changeUser.forEachChangedItem((r) =>
      console.log("changed " + r.key + " " + JSON.stringify(r.currentValue))
    );
    changeUser.forEachAddedItem((r) =>
      console.log("added " + r.key + " " + JSON.stringify(r.currentValue))
    );
    console.log(changeUser);
    console.log(event);
    console.log(this.userClone);
  }

  clickChild() {
    console.log(this.child);
    this.child.functionShow();
  }
}
