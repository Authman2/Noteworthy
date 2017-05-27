package gui

import javafx.scene.Node
import javafx.scene.Scene
import javafx.scene.control.Button
import javafx.scene.control.Label
import javafx.scene.control.TextArea
import javafx.scene.layout.HBox
import javafx.stage.Stage

/**
 * Created by adeolauthman on 5/26/17.
 */



/*
 * The document.
 */
class Document() : TextArea() {

    init  {
        styleClass.add("Document");
        stylesheets.add( javaClass.getResource("../styles/Components.css").toExternalForm() );
    }

}


/*
 * This is where all of the user's notes are viewed.
 */
class NoteViewer(): HBox() {

    init {
        styleClass.add("NoteViewer");
        stylesheets.add( javaClass.getResource("../styles/Components.css").toExternalForm() );

        height = 300.0;
    }

}


class PillButton(text: String): Button(text) {

    init {
        styleClass.add("PillButton");
        stylesheets.add( javaClass.getResource("../styles/Components.css").toExternalForm() );
    }

}