#ifndef NB_EDITWINDOW_H
#define NB_EDITWINDOW_H
#include <ncurses.h>
#include <panel.h>
#include <form.h>
#include <menu.h>

#include "CDirectory.h"

const string nameField = "Name:";
const string tagField = "Tags:";
const string typeName = "Type:";
const string typeOptions[3] = {"Text_Note", "Task_List", "Shop_List"};
const string labelEdit = "Edit/Insert:";
const string labelSave = "F6 save";
const string labelUpdate = "F6 update";
const string labelType = "TAB select type";
const string exportResultCSV = "Export to CSV F7";
const string exportResultHTML = ", HTML F8";
const string errorNotice = "Error:";


const int ESC = 27;
const int ENTER = 10;

//---------------------------------------------------------------------------------------
/*! \class EditWindow
 \brief Abstact class is for interfacing with user.
 Every instance of the class represents a single note of different types.
 Application during running have only one instance of this class in right part of terminal window.
 It needs for making different CRUD operation on notes: creating, showing, editing etc.
 Some attributes( pointers ) of class is not private because they are shared and cannot affect to instance.
 NCurses Window object allows to display window for editing while user spends time in menu windows and Panel
 object allows to associate application data with a panels panel.
 Class EditWindow cannot change anything in filesystem.
 EditWindow design is based on Ncurses libraries.
 */
class EditWindow
{
public:
                        EditWindow( int h, int w, int x, int y );
    virtual             ~EditWindow( void );
    virtual void        initRight( void );
/*! \fn EditWindow::createNote( CSQLManager* mn ) = 0
 \param[in] mn SQL manager of current session that provides inserting note to database.
 \brief Pure virtual function based on derived subclass represents graphical input for
 new note of same type and next inserting to database.
 */
    virtual int         createNote( CSQLManager* mn ) = 0;
    virtual int         showNote( CSQLManager* mn, CSearchRequest* rq ) = 0;
/*! \fn EditWindow::showResultListOfSearch( CSearchRequest* request, CSQLManager* manager, int option )
 \param[in] request Current session last request contents notes filtered by user criterions.
 \param[in] manager Connection to database. Uses in case of CRUD operations, updating, deleting, exporting.
 \param[in] option Based on option param will displayd import or request result list.
 \brief Function represents list of notes after request or import operation execution.
 */
    virtual int         showResultListOfSearch( CSearchRequest* request, CSQLManager* manager, int option );
    virtual int         importNotes( CSQLManager* manager, CSearchRequest* rq );

    PANEL*                          m_Panel;
    WINDOW*                         m_Win;

protected:
/*! \fn initEditField( int lines, int colm ) = 0
 \brief Pure virtual function based on derived subclass inicialize ncurses fields for user input.
 */
    virtual void        initEditField( int lines, int colm ) = 0;
    virtual void        splitStringToWords( string& pattern, set<string>& storage );
    virtual void        printNotice ( const string& type, const string& text )const;
    virtual void        updateFieldsAfterNotice( const int limit, const int curInd, const int curPos ) = 0;
/*! \fn getFileName()
 \brief Function inicialize and display field for user input. Using to set name of CSV or HTML file
 that will be created, to it will export list of notes selected by user.
 */
    virtual string      getFileName();
    virtual bool        checkIfNotEmptyInput( char * buffText,  const string notice );
    virtual void        getCSVContent( const string& fileContent);
    virtual void        closeInputAndFree( void )const = 0;
/*! \fn printItems( vector <CNote*>& resultList )const
 \brief Function represents selection menu with notes that will get by parametr.
 */
    virtual void        printItems( vector <CNote*>& resultList )const;
    virtual void        printDir( vector <string>& fileList, CDirectory * dir )const;
    
    WINDOW*                         m_Notice;
    int                             m_SelPos;
    int                             m_Offset;
};
//---------------------------------------------------------------------------------------

#endif /* NB_EDITWINDOW_H */
