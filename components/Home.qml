import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.Popups 0.1

Page {
    id: home;
    title: i18n.tr("Home");

    Grid {
        id: grid;
        columns: 1;
        width: units.gu(20);
        rowSpacing: units.gu(2);
        anchors.centerIn: parent;
        anchors.verticalCenterOffset: units.gu(-10);

        Button {
            id: start;
            width: parent.width;
            text: i18n.tr("Start Game");

            onClicked: {
                tabs.visible = false;
                pages.push(stage);
                stage.start();
            }
        }

        Button {
            id: about;
            width: parent.width;
            text: i18n.tr("About");

            onClicked: tabs.selectedTabIndex = tabAbout.index;
        }

        Button {
            id: quit;
            width: parent.width;
            text: i18n.tr("Quit");

            onClicked: Qt.quit();
        }
    }

}
