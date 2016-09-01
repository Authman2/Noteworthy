package GUI;

import java.io.File;
import java.net.URISyntaxException;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTree;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;

import MAIN.Noteworthy;

/** This is the gui that shows all of the user's notebooks, and notes under each notebook tab. */
public class NotebooksWindow extends JFrame {
	private static final long serialVersionUID = 1L;

	// The GUI window
	GUIWindow guiwindow;
	
	// The JTree for the notebooks
	JTree tree;
	
	
	public NotebooksWindow(GUIWindow f) {
		super("Notebooks");
		guiwindow = f;
		setBounds(f.getX() - 300, f.getY(), 300, 500);
		
		// Create default tree
		DefaultMutableTreeNode top = new DefaultMutableTreeNode("Notebooks");
	    tree = new JTree(top);
	    
	    loadNotebooks();
	    
	    // Put it on a scroll pane
	    JScrollPane treeView = new JScrollPane(tree);
	    add(treeView);
	    
	    setVisible(true);
	}
	
	/** Returns the tree used for displaying the notebooks. */
	public JTree getNotebookTree() {
		return tree;
	}
	
	/** Returns the main gui window. */
	public GUIWindow getGUIWindow() {
		return guiwindow;
	}
	
	/** Adds a new notebook to the list of notebooks. */
	public void addNotebook() {
		new CreateNotebookWindow(this);
	}

	/** Loads all of the notebooks that are in the application's bin. */
	private void loadNotebooks() {
		File file = null;
		try {
			file = new File(Noteworthy.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath() + "/");
		} catch (URISyntaxException e) { e.printStackTrace(); }
	    
	    for(File file2 : file.listFiles()) {
	    	if(file2.getAbsolutePath().contains("NOTEBOOK_")) {
	    		// Add the folder
	    		DefaultMutableTreeNode notebook = new DefaultMutableTreeNode(file2.getName());
	    		DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
	    		DefaultMutableTreeNode root = (DefaultMutableTreeNode) tree.getModel().getRoot();
	    	    DefaultMutableTreeNode child = new DefaultMutableTreeNode(notebook);
	    	    model.insertNodeInto(child, root, root.getChildCount());
	    	    
	    	    // Add any notes
	    	    for(File file3 : file2.listFiles()) {
	    	    	DefaultTreeModel model2 = (DefaultTreeModel) tree.getModel();
	    			DefaultMutableTreeNode notebook2 = (DefaultMutableTreeNode) tree.getModel().getChild(tree.getModel().getRoot(), findNotebookIndex(file2.getName()));
	    		    DefaultMutableTreeNode child2 = new DefaultMutableTreeNode(file3.getName());
	    		    model2.insertNodeInto(child2, notebook2, notebook2.getChildCount());
	    	    }
	    	}
	    }
	}
	
	/** Returns the index of a particular folder in the tree. */
	private int findNotebookIndex(String s) {
		for(int i = 0; i < tree.getModel().getChildCount(tree.getModel().getRoot()); i++) {
			if(tree.getModel().getChild(tree.getModel().getRoot(), i).toString().equals(s)) {
				return i;
			}
		}
		return -1;
	}
}
