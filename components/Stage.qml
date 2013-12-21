import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.Popups 0.1
import "../scripts/StageManager.js" as Manager

Page {
    id: stage;
    property int level: 1;
    property int tuxs: 0;
    property int time: 0;
    property int scores: 0;
    property int maxScores: 100;
    property string controlsPath: "../img/controls/";

    property string started: "started";
    property string stopped: "stopped";
    property string paused: "paused";
    property string completed: "completed";
    property string gameover: "gameover";

    state: stopped;
    title: i18n.tr("Level") +" "+ level; 

    function start() {
        Manager.startGame();
        stage.state = stage.started;
        button.iconSource = controlsPath +"pause.png";
    }

    function stop() {
        stage.state = stage.stopped;
        button.iconSource = controlsPath +"play.png";
    }

    function pause() {
        stage.state = stage.paused;
        button.iconSource = controlsPath +"play.png";
    }

    function complete() {
        stage.state = stage.completed;
        button.iconSource = controlsPath +"play.png";
        PopupUtils.open(levelFrame);
    }

    function gameOver() {
        stage.state = stage.gameover;
        button.iconSource = controlsPath +"redo.png";
        PopupUtils.open(gameOverFrame);
    }

    function resume() {
        stage.state = stage.started;
        button.iconSource = controlsPath +"pause.png";
    }

    // TODO must save data
    function nextLevel() {
        stage.level++;
        start();
    }


    function isStarted() {
        return stage.state === stage.started;
    }
    function isStopped() {
        return stage.state === stage.stopped;
    }
    function isPaused() {
        return stage.state === stage.paused;
    }
    function isCompleted() {
        return stage.state === stage.completed;
    }
    function isGameOver() {
        return stage.state === stage.gameover;
    }


    Component {
        id: levelFrame;
        Dialog {
            id: levelDialog;
            title: i18n.tr("Congratulation!\nLevel "+ level +" is completed!");
            text: i18n.tr("Do you wish to go to next level?");

            Button {
                text: i18n.tr("Next Level");
                onClicked: {
                    PopupUtils.close(levelDialog);
                    nextLevel();
                }
            }
            Button {
                text: i18n.tr("Quit");
                gradient: UbuntuColors.greyGradient
                onClicked: Qt.quit();
            }
        }
    }

    Component {
        id: gameOverFrame;
        Dialog {
            id: gameOverDialog;
            title: i18n.tr("Game Over!");
            text: i18n.tr("Do you wish to play again?");

            Button {
                text: i18n.tr("Play");
                onClicked: {
                    PopupUtils.close(gameOverDialog);
                    start();
                }
            }
            Button {
                text: i18n.tr("Quit");
                gradient: UbuntuColors.greyGradient
                onClicked: Qt.quit();
            }
        }
    }

    Panel {
        id: infoWrapper;
        anchors {
            top: parent.top;
            left: parent.left;
            right: parent.right;
            margins: units.gu(1);
            topMargin: units.gu(10);
        }
        Item {
            id: scoreWrapper;
            width: units.gu(8);
            height: units.gu(5);
            anchors {
                left: parent.left;
            }
            Label {
                id: scoreLabel;
                font.bold: true;
                text: i18n.tr("Scores");
                anchors.top: parent.top;
                anchors.horizontalCenter: parent.horizontalCenter;
            }
            Label {
                id: score;
                text: stage.scores.toString();
                anchors.bottom: parent.bottom;
                anchors.horizontalCenter: parent.horizontalCenter;
            }
        }

        Item {
            id: goalWrapper;
            anchors {
                left: scoreWrapper.right;
                right: bestScoreWrapper.left;
            }
            Grid{
                id: goalGrid;
                columns: 10;
                anchors.top: parent.top;
                anchors.horizontalCenter: parent.horizontalCenter;
                Repeater {
                    model: parent.columns;
                    Image {
                        width: 20;
                        height: width+2;
                        source: "../img/tux-mini.png";
                    }
                }
            }
            Label {
                id: goalLabel;
                font.bold: true;
                text: i18n.tr("Goal Reached!");
                visible: (goalGrid.columns === 0);
                anchors.top: parent.top;
                anchors.horizontalCenter: parent.horizontalCenter;
            }
            ProgressBar {
                id: goalBar;
                height: units.gu(2);
                value: stage.scores < stage.maxScores ? stage.scores : stage.maxScores;
                minimumValue: 0;
                maximumValue: maxScores;
                anchors {
                    top: parent.top;
                    left: parent.left;
                    right: parent.right;
                    margins: units.gu(1);
                    topMargin: units.gu(3);
                }
            }
        }

        Item {
            id: bestScoreWrapper;
            width: units.gu(12);
            height: units.gu(5);
            anchors {
                right: parent.right;
            }
            Label {
                id: bestScoreLabel;
                font.bold: true;
                text: i18n.tr("Best Scores");
                anchors.top: parent.top;
                anchors.horizontalCenter: parent.horizontalCenter;
            }
            Label {
                id: bestScore;
                text: "0";
                anchors.bottom: parent.bottom;
                anchors.horizontalCenter: parent.horizontalCenter;
            }
        }
    }

    Image {
        id: cave;
        opacity: 0.4;
        source: "../img/cave.png";
        anchors {
            bottom: timeBar.top;
            bottomMargin: units.gu(5);
            horizontalCenter: grid.horizontalCenter;
        }
    }

    GridView {
        id: grid;
        cellWidth: units.gu(7);
        cellHeight: units.gu(7);
        currentIndex: -1;
        interactive: false;

        model: ListModel {
            id: gModel;
        }

        // Note: Delegates are instantiated as needed and may be destroyed at any time.
        // State should never be stored in a delegate.
        delegate: Block {
            id: gBlock;
            image: img;
            property bool selected: GridView.isCurrentItem;
            color: {
                if (gBlock.selected) {
                    if (Manager.hasBug()) {
                        return "orange";
                    } else {
                        return "white";
                    }
                } else {
                    return "transparent";
                }
            }
            onClicked: Manager.select(index);
        }
        anchors {
            fill: parent;
            top: infoWrapper.bottom;
            topMargin: units.gu(8);
            margins: units.gu(1);
        }

        add: Transition {
            SequentialAnimation {
                PropertyAction { property: "opacity"; value: 0 }
                PauseAnimation { duration: 600 }
                PropertyAction { property: "state"; value: "explode" }
                ParallelAnimation {
                    NumberAnimation { property: "opacity"; from: 0; to: 1; duration: 400 }
                    NumberAnimation { property: "scale"; from: 0; to: 1; duration: 400 }
                    NumberAnimation { easing.amplitude: 1; properties: "y"; duration: 1000; easing.type: Easing.OutBounce }
                }
                PropertyAction { property: "state"; value: "" }
            }
        }

        remove: Transition {
            SequentialAnimation {
                PropertyAction { property: "state"; value: "explode" }
                NumberAnimation { property: "scale"; to: 0; duration: 400 }
            }
        }

        move: Transition {
            SequentialAnimation {
                PauseAnimation { duration: 200 }
                NumberAnimation { properties: "x"; duration: 200; }
                NumberAnimation { easing.amplitude: 0.8; properties: "y"; duration: 800; easing.type: Easing.OutBounce }
            }
        }

        displaced: Transition {
            SequentialAnimation {
                PauseAnimation { duration: 200 }
                NumberAnimation { properties: "x"; duration: 200; }
                NumberAnimation { easing.amplitude: 0.8; properties: "y"; duration: 800; easing.type: Easing.OutBounce }
            }
        }
    }

    Label {
        id: timeLabel;
        fontSize: "large";
        text: i18n.tr("Time");
        anchors {
            left: parent.left;
            margins: units.gu(1);
            verticalCenter: timeBar.verticalCenter;
        }
    }

    ProgressBar {
        id: timeBar;
        height: units.gu(3);
        width: parent.width;
        minimumValue: 0;
        maximumValue: 100;
        value: maximumValue;
        anchors {
            left: timeLabel.right;
            right: parent.right;
            bottom: button.top;
            margins: units.gu(1);
            bottomMargin: units.gu(2);
        }
        onValueChanged: {
            if (value === 0) {
                gameOver();
            } else {
                Manager.updateTroubleTime();
            }
        }
        SequentialAnimation on value {
            id: timer;
            running: isStarted();
            NumberAnimation {
                from: timeBar.value;
                to: timeBar.minimumValue;
                duration: stage.time;
            }
        }
    }

    Button {
        id: button;
        objectName: "stageButton";
        color: "transparent";
        width: units.gu(4);
        anchors {
            left: parent.left;
            bottom: parent.bottom;
            margins: units.gu(1);
            horizontalCenter: timeLabel.horizontalCenter;
        }
        onClicked: {
            if (isStopped()) {
                start();
            }
            else if (isStarted()) {
                pause();
            }
            else if (isPaused()) {
                resume();
            }
        }
    }

    Grid {
        id: status;
        objectName: "status";
        rows: 1;
        columnSpacing: units.gu(6.4);
        anchors {
            left: timeBar.left;
            leftMargin: units.gu(0.8);
            verticalCenter: button.verticalCenter;
        }
        Image {
            id: statusImgTux;
            source: "../img/tux-mini.png";
            Label {
                id: statusCountTux;
                fontSize: "large";
                text: "00";
                anchors {
                    left: parent.right;
                    leftMargin: units.gu(1);
                    verticalCenter: parent.verticalCenter;
                }
            }
        }
        Image {
            id: statusImgBug;
            source: "../img/bug-mini.png";
            Label {
                id: statusCountBug;
                fontSize: "large";
                text: "00";
                anchors {
                    left: parent.right;
                    leftMargin: units.gu(1);
                    verticalCenter: parent.verticalCenter;
                }
            }
        }
        Image {
            id: statusImgVirus;
            source: "../img/virus-mini.png";
            Label {
                id: statusCountVirus;
                fontSize: "large";
                text: "00";
                anchors {
                    left: parent.right;
                    leftMargin: units.gu(1);
                    verticalCenter: parent.verticalCenter;
                }
            }
        }
        Image {
            id: statusImgMoves;
            source: "../img/move-mini.png";
            Label {
                id: statusCountMoves;
                fontSize: "large";
                text: "00";
                anchors {
                    left: parent.right;
                    leftMargin: units.gu(1);
                    verticalCenter: parent.verticalCenter;
                }
            }
        }
    }
}
