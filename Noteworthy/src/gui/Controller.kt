/**
 * Created by adeolauthman on 5/26/17.
 */

package gui

import javafx.geometry.Pos
import javafx.scene.Node
import javafx.scene.control.*
import javafx.scene.layout.BorderPane
import javafx.scene.layout.HBox
import javafx.scene.text.TextAlignment
import javax.swing.GroupLayout
import com.sun.javafx.robot.impl.FXRobotHelper.getChildren
import javafx.scene.Scene
import javafx.stage.Stage
import java.util.Collections.addAll







class Controller(val stage: Stage, var scenes: MutableList<Scene>) {

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



    /*********************
     *                   *
     *   INITIALIZATION  *
     *                   *
     *********************/

    init {
        this.createMenu()
        components.add(pane)
    }



    /*********************
     *                   *
     *      SETTERS      *
     *                   *
     *********************/

    fun createMenu() {
        menuBar.isUseSystemMenuBar = true

        // Menus
        val fileMenu = Menu("File")
        val helpMenu = Menu("Help")
        val userMenu = Menu("User")

        // Menu Items
        val new = MenuItem("New")
        val open = MenuItem("Open")
        val save = MenuItem("Save")
        new.setOnAction { e -> println("New project") }
        open.setOnAction { e -> println("Opening project") }
        save.setOnAction { e -> println("Save project") }

        val login = MenuItem("Login")
        val signout = MenuItem("Sign Out")
        val accountSettings = MenuItem("Account Settings")
        login.setOnAction { e ->
            stage.scene = scenes.get(1)
        }


        // Add all the menu items.
        fileMenu.items.addAll(new, open, save)
        userMenu.items.addAll(accountSettings, login, signout)

        menuBar.menus.addAll(fileMenu, userMenu, helpMenu)

        pane.top = menuBar
    }



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