package gui

import javafx.geometry.Insets
import javafx.geometry.Pos
import javafx.scene.Node
import javafx.scene.control.Button
import javafx.scene.control.Label
import javafx.scene.control.TextField
import javafx.scene.layout.BorderPane
import javafx.scene.layout.HBox
import javafx.scene.layout.VBox
import javafx.scene.text.Text
import javafx.scene.text.TextAlignment

/**
 * Created by adeolauthman on 5/26/17.
 */


class LoginController() {

    /*********************
     *                   *
     *     VARIABLES     *
     *                   *
     *********************/

    private var components: MutableList<Node> = mutableListOf()


    // The main border pane
    val pane = BorderPane()




    /*********************
     *                   *
     *   INITIALIZATION  *
     *                   *
     *********************/

    init {
        val hbox = HBox()
        val label = Label("Login")
        label.styleClass.add("LoginTitle")
        label.stylesheets.add( javaClass.getResource("../styles/Components.css").toExternalForm() );
        hbox.children.add(label)
        hbox.alignmentProperty().set(Pos.CENTER)
        hbox.paddingProperty().set( Insets(25.0, 0.0, 30.0, 0.0) )


        val vbox = VBox()
        val emailField = TextField()
        val passwordField = TextField()
        emailField.promptText = "Enter your email"
        passwordField.promptText = "Enter your password"

        val loginBtn = PillButton("Login")
        val cancel = PillButton("Cancel")
        loginBtn.id = "loginBtn"
        cancel.id = "cancelBtn"
        loginBtn.prefWidth(200.0)
        cancel.prefWidth(200.0)
        loginBtn.prefHeight(30.0)
        cancel.prefHeight(30.0)
        loginBtn.setOnAction { e ->  }
        cancel.setOnAction { e ->  }

        vbox.spacingProperty().set( 30.0 )
        vbox.alignmentProperty().set( Pos.CENTER )
        vbox.children.addAll(emailField, passwordField, loginBtn, cancel )
        vbox.paddingProperty().set( Insets(0.0, 30.0, 30.0, 30.0) )


        pane.top = hbox
        pane.center = vbox
        components.add(pane)
    }




    /*********************
     *                   *
     *      GETTERS      *
     *                   *
     *********************/


    // Returns all of the components in the app.
    fun getComponents(): Collection<Node> = components
}