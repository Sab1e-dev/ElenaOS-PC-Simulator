export function timer_example() {

    let timer = lv.timer.create(function (t) {
        eos.print("Timer triggered");
        eos.print("Timer name: ", lv.timer.getUserData(timer).name);
    }, 1000);
    lv.timer.pause(timer);
    lv.timer.setUserData(timer, {
        "name": "My timer"
    });
    eos.print("Paused? ", lv.timer.getPaused(timer));

    let basicTimer = lv.timer.createBasic();
    lv.timer.setCb(basicTimer, function (t) {
        eos.print("Basic timer triggered");
        lv.timer.resume(timer);
        lv.timer.reset(timer);
    })
    lv.timer.setRepeatCount(basicTimer, 1);
    lv.timer.setPeriod(basicTimer, 1000);
}
