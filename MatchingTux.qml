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

    Tabs {
        id: pages;
        Tab {
            title: stage.title;
            page: Stage {
                id: stage;
                level: 20;
            }
        }
        Tab {
            title: about.title;
            page: About {
                id: about;
            }
        }
    }
}
