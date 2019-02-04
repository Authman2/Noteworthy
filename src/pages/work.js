import { Mosaic } from '@authman2/mosaic';
// import firebase from 'firebase';
import Globals from '../other/Globals';

import ViewContext from '../components/contexts/viewContext';
import SelectionContext from '../components/contexts/selectionContext';
import InsertContext from '../components/contexts/insertContext';
import SettingsContext from '../components/contexts/settingsContext';

import Create from '../alerts/create';
import NotesView from '../alerts/notebooks';
import Account from '../alerts/account';

export default new Mosaic({
    data: {
        context: 0,
        loadedData: {},
        currentNotebook: null,
        currentNote: null,

        notebooks: [],
        notes: [],
        showNotebooks: false,
        showNotes: false,
        showCreate: false
    },
    view: function() {
        let cm = <ViewContext link={{ name: 'vc', parent: this }} />;
        switch(this.data.context) {
            case 0: break;
            case 1: cm = <SelectionContext link={{ name: 'sc', parent: this }} />; break;
            case 2: cm = <InsertContext link={{ name: 'ic', parent: this }} />; break;
            case 3: cm = <SettingsContext link={{ name: 'stc', parent: this }} />; break;
            default: break;
        }

        return <div class='work'>
            <div class='context-menu-holder'>
                { cm }
            </div>

            <div contenteditable='true' type='text' id='work-title-field'>
                { this.data.currentNote ? this.data.currentNote.title : 'Title' }
            </div>
            <div contenteditable='true' id='work-content-field' onclick={this.actions.switchContextOnTripleTap}></div>

            {/* Alerts */}
            {
                this.data.showCreate ?  <Create onCreate={(type, title) => {
                    console.log(type, title);
                }}/> : <div></div>
            }
            {
                this.data.showNotebooks ? <NotesView type='Notebook' items={this.data.notebooks} link={{ name: 'notebooks', parent: this }} />
                                    : <div></div>
            }
            {
                this.data.showNotes ? <NotesView type='Note' items={this.data.notes} link={{ name: 'notes', parent: this }} />
                                : <div></div>
            }
        </div>
    },

    actions: {
        handleNew: function() {
            this.data.showCreate = true;
        },
        openNotebooks: function() {
            let items = Array.from(Object.values(this.data.loadedData).filter(item => item.pages));
            this.data.notebooks = items;
            this.data.showNotebooks = true;
        },
        openNotes: function() {
            if(!this.data.currentNotebook) {
                Globals.showActionAlert(`Please select a notebook to open a note from.`, Globals.ColorScheme.red);
                return;
            }
            let items = Array.from(Object.values(this.data.loadedData).filter(item => {
                return !item.pages && item.notebook === this.data.currentNotebook.id
            }));
            
            this.data.notes = items;
            this.data.showNotes = true;
        },
        openAccount: function() {
            this.data.alert = <Account handleLogout={() => {
                console.log('logging out');
            }}/>
        },

        closeAlert: function() {
            this.data.showNotebooks = false;
            this.data.showNotes = false;
        }
    },
});