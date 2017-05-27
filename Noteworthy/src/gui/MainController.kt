package gui

import javafx.geometry.Pos
import javafx.scene.Node
import javafx.scene.control.*
import javafx.scene.layout.BorderPane
import javafx.scene.layout.HBox
import javafx.scene.text.TextAlignment
import javax.swing.GroupLayout
import com.sun.javafx.robot.impl.FXRobotHelper.getChildren
import java.util.Collections.addAll




/**
 * Created by adeolauthman on 5/26/17.
 */


class MainController() {

    /*********************
     *                   *
     *     VARIABLES     *
     *                   *
     *********************/

    private var components: MutableList<Node> = mutableListOf()


    // The main border pane
    val pane = BorderPane()


    // The menu
    val menuBar = MenuBar()


    // The text area for document.
    var textArea: Document = Document()


    // The button that opens up the slider to see all notes.
    var openNotesBtn: Button = Button("^")


    // The



    /*********************
     *                   *
     *   INITIALIZATION  *
     *                   *
     *********************/

    init {
        // Create the tab pane
        val tabPane = TabPane()
        val noteTab = Tab()
        noteTab.setText("Title")
        noteTab.setContent(textArea)
        tabPane.tabs.add(noteTab)


        // Setup the button for opening the notes
        val hbox = HBox()
        openNotesBtn.styleClass.add("OpenNotesBtn")
        openNotesBtn.stylesheets.add( javaClass.getResource("../styles/Components.css").toExternalForm() );
        hbox.children.add(openNotesBtn)
        hbox.alignment = Pos.CENTER


        // The menu that goes at the bottom of the app for viewing notes.



        pane.bottom = hbox
        pane.center = tabPane
        components.add(pane)
    }



    /*********************
     *                   *
     *      SETTERS      *
     *                   *
     *********************/



    /*********************
     *                   *
     *      GETTERS      *
     *                   *
     *********************/


    // Returns all of the components in the app.
    fun getComponents(): Collection<Node> = components


    // Returns the menu
    fun getMenu(): MenuBar = menuBar
}