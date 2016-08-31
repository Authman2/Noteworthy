package GUI;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTree;
import javax.swing.tree.DefaultMutableTreeNode;

/** This is the gui that shows all of the user's notebooks, and notes under each notebook tab. */
public class NotebooksWindow extends JFrame {
	private static final long serialVersionUID = 1L;

	// The JTree for the notebooks
	JTree tree;
	
	
	public NotebooksWindow(JFrame f) {
		super("Notebooks");
		setBounds(f.getX() - 300, f.getY(), 300, 500);
		
		// Create default tree
		DefaultMutableTreeNode top = new DefaultMutableTreeNode("Notebooks");
	    tree = new JTree(top);

	    // Put it on a scroll pane
	    JScrollPane treeView = new JScrollPane(tree);
	    add(treeView);
	    
	    setVisible(true);
	}
	
	/** Returns the tree used for displaying the notebooks. */
	public JTree getNotebookTree() {
		return tree;
	}
	
	/** Adds a new notebook to the list of notebooks. */
	public void addNotebook() {
		new CreateNotebookWindow(this);
	}
	
}
