import QtQuick 2.0
import Ubuntu.Components 0.1

Button {
    id: block;
    width: units.gu(8);
    height: width;
    color: changeColor();
    scale: changeScale();
    text: x+","+y;

    property int pos;
    property url image;
    property bool selected: false;

    Image {
        source: image;
        anchors {
            fill: parent;
            margins: units.gu(0.4);
        }
    }

    onClicked: {
        selected = !selected;
    }

    Behavior on scale {
        NumberAnimation { duration: 200 }
    }


    function changeColor()
    {
        if (selected)
        {
//            if (Manager.hasBug()) {
//                return "orange";
//            } else {
                return "white";
//            }
        }
        return "red";
    }

    function changeScale() {
        if (selected) {
            return 0.8;
        }
        return 1;
    }
}
