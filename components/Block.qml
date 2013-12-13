import QtQuick 2.0
import QtQuick.Particles 2.0
import Ubuntu.Components 0.1

Button {
    id: block;
    width: units.gu(6);
    height: width;
    color: "transparent";
    property url image;

    states: [
        State {
            name: "";
        },
        State {
            name: "explode";
            StateChangeScript { script: emitter.burst(50) }
        }
    ]

    Image {
        source: image;
        anchors {
            fill: parent;
            margins: units.gu(0.4);
        }
    }

    ParticleSystem {
        anchors.fill: parent

        ImageParticle {
            source: block.image
            alpha: 0.6
            colorVariation: 0.1
            rotationVelocityVariation: 360
        }

        Emitter {
            id: emitter
            enabled: false
            anchors.fill: parent
            emitRate: 500
            lifeSpan: 800
            size: 16
            sizeVariation: 4
            velocity: AngleDirection {angleVariation: 360; magnitude: 80; magnitudeVariation: 40}
        }
    }

}
