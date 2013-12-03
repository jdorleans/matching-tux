import QtQuick 2.0
import Ubuntu.Components 0.1

Button {
    id: block;
    width: units.gu(6);
    height: width;
    color: "transparent";
    property url image;

    Image {
        source: image;
        anchors {
            fill: parent;
            margins: units.gu(0.4);
        }
    }

}
