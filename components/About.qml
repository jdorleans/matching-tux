import QtQuick 2.0
import Ubuntu.Components 0.1

Page {
    id: about;
    title: i18n.tr("About");

    Image {
        id: image;
        source: "../img/tux.png";
        anchors {
            top: parent.top;
            topMargin: units.gu(4);
            horizontalCenter: parent.horizontalCenter;
        }
    }
    Label {
        id: game;
        fontSize: "x-large";
        text: "Matching Tux";
        anchors {
            top: image.bottom;
            topMargin: units.gu(1);
            horizontalCenter: parent.horizontalCenter;
        }
    }

    Label {
        id: title;
        fontSize: "large";
        text: i18n.tr("Created By");
        anchors {
            top: game.bottom;
            topMargin: units.gu(4);
            horizontalCenter: parent.horizontalCenter;
        }
    }
    Label {
        id: author;
        fontSize: "large";
        text: "Jonathan D'Orleans";
        anchors {
            top: title.bottom;
            topMargin: units.gu(2);
            horizontalCenter: parent.horizontalCenter;
        }
    }
    Label {
        id: email;
        fontSize: "medium";
        text: "<jonathan.dorleans@gmail.com>";
        anchors {
            top: author.bottom;
            topMargin: units.gu(1);
            horizontalCenter: parent.horizontalCenter;
        }
    }

}
