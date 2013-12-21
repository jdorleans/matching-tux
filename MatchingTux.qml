import QtQuick 2.0
import Ubuntu.Components 0.1
import "components"

/*!
    \brief MainView with a Label and Button elements.
*/

MainView {
    // objectName for functional testing purposes (autopilot-qt5)
    objectName: "mainView"

    // Note! applicationName needs to match the "name" field of the click manifest
    applicationName: "com.ubuntu.developer.jonathan.dorleans.MatchingTux"

    /*
     This property enables the application to change orientation
     when the device is rotated. The default is false.
    */
    //automaticOrientation: true

    id: mainView;
    width: units.gu(50);
    height: units.gu(80);

    PageStack {
        id: pages
        Component.onCompleted: push(tabs);

        Tabs {
            id: tabs;
            visible: false

            Tab {
                id: tabHome;
                title: home.title;
                property int index: 0;

                page: Home {
                    id: home;
                }
            }

            Tab {
                id: tabAbout;
                title: about.title;
                property int index: 1;

                page: About {
                    id: about;
                }
            }
        }

        Stage {
            id: stage;
            level: 1; // DEBUG
            visible: false;
        }
    }

}
