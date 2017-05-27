import gui.Controller
import gui.LoginController
import gui.MainController
import javafx.application.Application
import javafx.scene.layout.StackPane
import javafx.stage.Stage
import javafx.scene.Scene

/**
 * Created by adeolauthman on 5/26/17.
 */


class Noteworthy(): Application() {

    val WIDTH: Double = 640.0
    val HEIGHT: Double = 480.0




    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            launch(Noteworthy::class.java)
        }
    }


    override fun start(stage: Stage?) {
        if(stage is Stage) {

            // Create a controller object, which creates all of the components
            val mainController: MainController = MainController()
            val loginController: LoginController = LoginController()


            // Add all of the components to the app.
            val root = StackPane();
            root.children.addAll( mainController.getComponents() )

            val login = StackPane();
            login.children.addAll( loginController.getComponents() )




            // Create the scene.
            val mainScene = Scene(root, WIDTH, HEIGHT)
            val loginScene = Scene(login, WIDTH, HEIGHT)

            val controller: Controller = Controller(stage = stage, scenes = mutableListOf(mainScene, loginScene) )
            root.children.addAll( controller.getComponents() )

            stage.scene = mainScene
            stage.title = "Noteworthy"
            stage.show()
        }
    }
}