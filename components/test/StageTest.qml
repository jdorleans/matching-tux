import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.Popups 0.1
import "../../scripts/StageManager.js" as Manager

Page {
    id: stage;
    state: "stopped";

    property int level: 1;
    property int tuxs: 0;
    property int time: 0;
    property int scores: 0;
    property int maxScores: 100;

    title: i18n.tr("Test Level") +" "+ level;
    states: [
        State {
            name: "stopped";
            PropertyChanges {
                target: button;
                iconSource: "../../img/controls/play.png";
            }
        },
        State {
            name: "started";
            PropertyChanges {
                target: button;
                iconSource: "../../img/controls/pause.png";
            }
        },
        State {
            name: "paused";
            PropertyChanges {
                target: button;
                iconSource: "../../img/controls/play.png";
            }
        },
        State {
            name: "completed";
            PropertyChanges {
                target: button;
                iconSource: "../../img/controls/play.png";
            }
            onCompleted: {
                PopupUtils.open(nextlevel);
            }
        },
        State {
            name: "gameover";
            PropertyChanges {
                target: button;
                iconSource: "../../img/controls/redo.png";
            }
        }
    ]

    Component {
        id: nextlevel;
        Dialog {
            id: dialog;
            title: i18n.tr("Congratulation!\nYou saved Tux!");
            text: i18n.tr("Do you want to go to next level?");

            Button {
                text: i18n.tr("Go to Next Level");
                onClicked: {
                    // must save data
                    stage.level++;
                    Manager.startGame();
                    PopupUtils.close(dialog);
                    stage.state = "started";
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
                        source: "../../img/tux-mini.png";
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
        source: "../../img/cave.png";
        anchors {
            bottom: timeBar.top;
            bottomMargin: units.gu(5);
            horizontalCenter: grid.horizontalCenter;
        }
    }

    Grid {
        id: grid;
        rows: 7;
        columns: 7;
        rowSpacing: units.gu(1);
        columnSpacing: units.gu(1);
        anchors {
            fill: parent;
            top: infoWrapper.bottom;
            topMargin: units.gu(8);
            margins: units.gu(1);
        }

        Repeater {
            id: rep;
            model: 49;
            BlockTest {
                id: block;
                pos: index;
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
                stage.state = "gameover";
            } else {
                Manager.updateTroubleTime();
            }
        }
        SequentialAnimation on value {
            id: timer;
            running: stage.state === "started";
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
            if (stage.state === "stopped") {
                Manager.startGame();
                stage.state = "started";
            }
            else if (stage.state === "started") {
                stage.state = "paused";
            }
            else if (stage.state === "paused") {
                stage.state = "started";
            }
            else if (stage.state === "completed") {
                PopupUtils.open(nextlevel);
            }
            else if (stage.state === "gameover") {
                Manager.startGame();
                stage.state = "started";
            }
        }
    }

    Grid {
        id: status;
        objectName: "status";
        rows: 1;
        columnSpacing: units.gu(6);
        anchors {
            left: timeBar.left;
            leftMargin: 1;
            verticalCenter: button.verticalCenter;
        }
        Image {
            id: statusImgTux;
            source: "../../img/tux-mini.png";
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
            source: "../../img/bug-mini.png";
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
            source: "../../img/virus-mini.png";
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
            source: "../../img/move-mini.png";
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