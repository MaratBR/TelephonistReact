class Events<T extends object> {
  raiseEvent<K extends keyof T>(key: K, value: T[K]) {
    // do something here
  }
}

interface EventsDictionary {
  somethingHappened: number;
  whatever: string;
}

interface AdditionalEvents {
  disconnnected: CloseEvent;
}

//type AddAdditional<T extends object> = Omit<T, keyof AdditionalEvents> & AdditionalEvents

type Merge<T, T2> = {
  [K in keyof T]: K extends keyof T2 ? T2[K] : T[K];
} & T2;

type AddAdditional<T extends object> = Merge<T, AdditionalEvents>;

const events = new Events<AddAdditional<EventsDictionary>>();
events.raiseEvent("disconnnected", new CloseEvent("...")); // works fine

type Something = {};

class SomeOtherClass<Something extends object> {
  constructor() {
    const events = new Events<AddAdditional<Something>>();
    events.raiseEvent("disconnnected", new CloseEvent("..."));
    //                                 ^^^^^^^^^^^^^^^^^^^^^
    // Argument of type 'CloseEvent' is not assignable to parameter of type 'Something["connnected"] & CloseEvent'.
    //  Type 'CloseEvent' is not assignable to type 'Something["connnected"]'.ts(2345)
  }
}
