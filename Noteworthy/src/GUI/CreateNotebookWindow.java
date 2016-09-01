package GUI;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.JTree;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.tree.TreePath;

import EXTRA.Note;
import MAIN.Noteworthy;

public class CreateNotebookWindow extends JFrame {
	private static final long serialVersionUID = 1L;

	// The jtree from the notebook list.
	JTree tree;
	
	// The notebooks window
	NotebooksWindow nbw;
	
	
	public CreateNotebookWindow(NotebooksWindow nbw) {
		super("Create Notebook");
		setSize(500, 100);
		setLocationRelativeTo(null);
		JFrame frame = this;
		this.nbw = nbw;
		tree = nbw.getNotebookTree();
		
		JTextField notebookNameField = new JTextField();
		notebookNameField.setText("Enter the name of the notebook here");
		
		
		JButton cancel = new JButton("Cancel");
		cancel.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				frame.dispose();
			}
		});
		
		
		JButton createNotebook = new JButton("Create Notebook");
		createNotebook.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				if(!notebookNameField.getText().equals("") && notebookNameField.getText() != null) {
					addNotebook(notebookNameField.getText(), frame);
				} else {
					JOptionPane.showMessageDialog(frame, "You must enter a name for the notebook", "Missing Name", JOptionPane.ERROR_MESSAGE);
				}
			}
		});
		
		JPanel north = new JPanel(new GridLayout(1,1,1,1));
		north.add(notebookNameField);
		
		JPanel south = new JPanel(new GridLayout(1,2,1,1));
		south.add(cancel);
		south.add(createNotebook);
		
		add(north, BorderLayout.NORTH);
		add(south, BorderLayout.SOUTH);
		
		setVisible(true);
	}

	/** Adds a new notebook to the list of notebooks. */
	public void addNotebook(String name, JFrame f) {
		DefaultMutableTreeNode notebook = new DefaultMutableTreeNode(name);
		DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
		DefaultMutableTreeNode root = (DefaultMutableTreeNode) tree.getModel().getRoot();
	    DefaultMutableTreeNode child = new DefaultMutableTreeNode(notebook);
	    model.insertNodeInto(child, root, root.getChildCount());
	    tree.scrollPathToVisible(new TreePath(child.getPath()));
	    
	    String path = Noteworthy.class.getProtectionDomain().getCodeSource().getLocation().getPath() + "NOTEBOOK_" + name;
	    File folder = new File(path);
	    
	    if(!folder.mkdir()) {
	    	System.out.println("Failed to create folder");
	    } else {
	    	System.out.println("Success");
	    }
	    
	    // Change the temporary note in the GUIWindow
	    nbw.getGUIWindow().tempNote = new Note(notebook.toString(), "Title", "Note");
	    
	}
}
