package GUI;

import java.io.File;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTree;
import javax.swing.event.TreeSelectionEvent;
import javax.swing.event.TreeSelectionListener;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;

import MAIN.Noteworthy;
import filesje.ReadFile;

/** This is the gui that shows all of the user's notebooks, and notes under each notebook tab. */
public class NotebooksWindow extends JFrame {
	private static final long serialVersionUID = 1L;

	// The GUI window
	GUIWindow guiwindow;
	
	// The JTree for the notebooks
	JTree tree;
	
	// The last directory (folder) that was clicked
	String lastDirectory;
	
	
	public NotebooksWindow(GUIWindow f) {
		super("Notebooks");
		guiwindow = f;
		setBounds(f.getX() - 300, f.getY(), 300, 500);
		
		// Create default tree
		DefaultMutableTreeNode top = new DefaultMutableTreeNode("Notebooks");
	    tree = new JTree(top);
	    
	    // Load all of the user's previously created notebooks and notes
	    loadNotebooks();
	    
	    // Put it on a scroll pane
	    JScrollPane treeView = new JScrollPane(tree);
	    add(treeView);
	    
	    /* This handles switching between notes when you select it from the JTree. */
	    tree.addTreeSelectionListener(new TreeSelectionListener() {
			@Override
			public void valueChanged(TreeSelectionEvent e) {
				File file = new File(Noteworthy.class.getProtectionDomain().getCodeSource().getLocation().getPath() + tree.getLastSelectedPathComponent());
				lastDirectory = "";
				
				if(!file.isDirectory()) {
					// If there is a valid parent folder.
					if(tree.getSelectionPath().getParentPath() != null) {
						String parent = "";
						
						// Try to tweak the name of the parent to form it into a directory path
						parent = "" + tree.getSelectionPath().getParentPath();
						parent = parent.substring(12, parent.length() - 1) + "/";
						
						// Set the file's new path
						file = new File(Noteworthy.class.getProtectionDomain().getCodeSource().getLocation().getPath() + parent + tree.getLastSelectedPathComponent());
						
					 	//Using my "ReadFile" class.
					 	ReadFile reader = new ReadFile();
						String loadedNote = "";
						
						//Try loading the file's text
						try { loadedNote = reader.read(file.getAbsolutePath()); } catch (Exception e1) { e1.printStackTrace(); }
				        
						//Set the texts
						if(file.getName().endsWith(".ntwy"))
							guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-5));
						else
							guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-4));
						guiwindow.noteArea.setText(loadedNote.substring(7));
					}
				}
			}
	    });
	    
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
		String path = "";
		try {
			path = Noteworthy.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath() + "/";
			
			// Print out the path
			System.out.println(path);
			
			file = new File(path);
		} catch (Exception e) { e.printStackTrace(); }
	    
		// BELOW: assumes that "file" is a directory, so "file2" is a file inside of that directory
	    for(File file2 : file.listFiles()) {
	    	if(file2.getAbsolutePath().contains("NOTEBOOK_")) {
	    		// Add the folder
	    		DefaultMutableTreeNode notebook = new DefaultMutableTreeNode(file2.getName());
	    		DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
	    		DefaultMutableTreeNode root = (DefaultMutableTreeNode) tree.getModel().getRoot();
	    	    DefaultMutableTreeNode child = new DefaultMutableTreeNode(notebook);
	    	    model.insertNodeInto(child, root, root.getChildCount());
	    	    
	    	    // Add any notes from that notebook
	    	    for(File file3 : file2.listFiles()) {
	    	    	// Make sure it's not the styles file.
	    	    	if(file3.getName().endsWith(".ntwy")) {
		    	    	DefaultTreeModel model2 = (DefaultTreeModel) tree.getModel();
		    			DefaultMutableTreeNode notebook2 = (DefaultMutableTreeNode) tree.getModel().getChild(tree.getModel().getRoot(), findNotebookIndex(file2.getName()));
		    		    DefaultMutableTreeNode child2 = new DefaultMutableTreeNode(file3.getName());
		    		    model2.insertNodeInto(child2, notebook2, notebook2.getChildCount());
	    	    	}
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
