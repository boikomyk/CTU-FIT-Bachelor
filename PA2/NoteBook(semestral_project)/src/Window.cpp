#include "Window.h"


const string labelMenu = "Menu :";
const string labelSelect = "Select : ";
const string menu[4] = {"Create note" , "Find note", "Import section", "Close application"};
const string searchOptions[5] = {"By tags" , "By name", "By text", "All notes"};
const string createOptions[4] = {"TextNote" , "TaskList", "ShopList", "Return"};
// field buffers
static FIELD*   INPUT_FIELD[2];
static WINDOW*  NB_ASK_WIN;
// form interacte with user, fields routine
static FORM*    NB_ASK_FORM;

//---------------------------------------------------------------------------------------
Window::~Window( void )
{
    del_panel(m_Panel);
    delwin(m_Win);
}

//---------------------------------------------------------------------------------------
Window::Window(int h, int w, int x, int y )
:m_SelPos(0)
{
    m_Win = newwin( h , w, x, y );
    keypad( m_Win, TRUE );
    m_Panel = new_panel(m_Win);
}
//---------------------------------------------------------------------------------------
void Window::initLeft( void )
{
    wclear( m_Win );
    box( m_Win, 0, 0 );
    mvwprintw(m_Win,1,3, labelMenu.c_str());
    //int mvvline(int y, int x, chtype ch, int n);
    mvwhline(m_Win, 2, 1, 0,  COLS/4 - 3);
}

//---------------------------------------------------------------------------------------

void Window::initSelect( void )
{
    wclear( m_Win );
    box( m_Win, 0, 0 );
    mvwprintw(m_Win,1,3, labelSelect.c_str());
    mvwhline(m_Win, 2, 1, 0, COLS/4 - 3);
}

//---------------------------------------------------------------------------------------
void  Window::printItems( void )const
{
    int  width = COLS/4 - 3, menulength = 4;
    char formatstring[7];
    curs_set(0);
    sprintf(formatstring,"%%-%ds",width);
    
    for (int i=0; i < menulength; i++)
    {
        if (i == m_SelPos)
            wattron(m_Win, A_REVERSE);
        mvwprintw(m_Win, 3+i, 1, formatstring, menu[i].c_str());
        wattroff(m_Win, A_REVERSE);
        wrefresh( m_Win );
    }
}
//---------------------------------------------------------------------------------------

void  Window::printSelect(const string * array  )const
{
    int  width = COLS/4 - 3, menulength = 4;
    char formatstring[7];
    curs_set(0);
    sprintf(formatstring,"%%-%ds",width);
    
    for (int i=0; i < menulength; i++)
    {
        if (i == m_SelPos)
            wattron(m_Win, A_REVERSE);
        mvwprintw(m_Win, 3+i, 1, formatstring, array[i].c_str());
        wattroff(m_Win, A_REVERSE);
        wrefresh( m_Win );
    }
}
//---------------------------------------------------------------------------------------
int Window::menuInterfase( EditWindow& dst)
{
    int key= 0;
    
    while( 1 )
    {
        printItems();
        wrefresh( dst.m_Win );

        key = getch();

        switch(key)
        {
            case 10: // KEY_ENTER
                if(m_SelPos == 0){
                    return 2;       // Create new note
                }
                else if(m_SelPos == 1)
                    return 1;
                else if(m_SelPos == 2) // ImportFile
                    return 15;
                else if(m_SelPos == 3)  // Exit
                    return -1;
                break;
                
            case KEY_F(9):
                return -1;
                
            case KEY_UP:
                if (m_SelPos)
                {
                    m_SelPos--;

                }
                else m_SelPos = 3;
                break;
                
            case KEY_DOWN:
                if (m_SelPos < 3)
                {
                    m_SelPos++;
                }
                else
                    m_SelPos = 0;
                break;
                
        }
    }
    return 0;

}

//---------------------------------------------------------------------------------------

int Window::selectInterfase( EditWindow& dst){
    int key= 0;
    
    while( 1 )
    {
        printSelect(searchOptions);
        wrefresh( dst.m_Win );
        
        key = getch();
        
        switch(key)
        {
            case 10: // KEY_ENTER
                if(m_SelPos == 0)   // By tags
                    return 7;
                if(m_SelPos == 1)   // By name
                    return 8;
                if(m_SelPos == 2)   // By text
                    return 9;
                if(m_SelPos == 3)   // All notes
                    return 11;
                break;
            case 27 :   // ESC
                return 0;
                
            case KEY_F(9):
                return -1;
                
            case KEY_UP:
                if (m_SelPos)
                {
                    m_SelPos--;
                    
                }
                else m_SelPos = 3;
                break;
                
            case KEY_DOWN:
                if (m_SelPos < 3)
                {
                    m_SelPos++;
                }
                else
                    m_SelPos = 0;
                break;

        }
    }
    return 0;
}

//---------------------------------------------------------------------------------------

int Window::createInterface( EditWindow& dst){
    int key= 0;
    
    while( 1 )
    {
        printSelect(createOptions);
        wrefresh( dst.m_Win );
        
        key = getch();
        
        switch(key)
        {
            case 10: // KEY_ENTER
                if(m_SelPos == 0)   // Create TextNote
                    return 4;
                if(m_SelPos == 1)   // Create TaskList
                    return 5;
                if(m_SelPos == 2)   // Create ShopList
                    return 6;
                if(m_SelPos == 3){
                    return 0;
                }
                break;
            case KEY_F(9):
                return -1;
                
            case KEY_UP:
                if (m_SelPos)
                {
                    m_SelPos--;
                    
                }
                else m_SelPos = 3;
                break;
                
            case KEY_DOWN:
                if (m_SelPos < 3)
                {
                    m_SelPos++;
                }
                else
                    m_SelPos = 0;
                break;
                
        }
    }
    return 0;
}
//---------------------------------------------------------------------------------------

int Window::getSearchPattern( CSearchRequest* request, int keyGui ){
    if(keyGui == 11){
        return 10;
    }
    
    mvwprintw(m_Win,1,3, "Search by:");
    mvwhline(m_Win, 2, 1, 0,  COLS/4 - 3);

    
    INPUT_FIELD[0] = new_field(LINES/2 - 6, COLS/4 - 3, 0, 0, 0, 0);
    set_field_buffer(INPUT_FIELD[0], 0, 0);
    set_field_opts(INPUT_FIELD[0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
    NB_ASK_FORM = new_form(INPUT_FIELD);
    //WINDOW *derwin(WINDOW *orig, int nlines, int ncols, int begin_y, int begin_x);
    set_form_sub(NB_ASK_FORM, derwin(panel_window(m_Panel), LINES/2 - 6, COLS/4 - 3, 3, 1));
    NB_ASK_WIN  =  panel_window(m_Panel);
    post_form(NB_ASK_FORM);
    show_panel(m_Panel);
    update_panels();
    doupdate();
    refresh();
    
    wrefresh(NB_ASK_WIN);
    int key;
    
    while ((key = getch()) != 10)
    {
        switch (key)
        {
            case KEY_F(9):
                return -1;
            case 10:
                break;
            case KEY_LEFT:
                form_driver(NB_ASK_FORM, REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORM, REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                form_driver(NB_ASK_FORM, REQ_DEL_PREV);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORM, REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORM, key);
                break;
        }
        wrefresh(NB_ASK_WIN);
    }
    
    
    form_driver(NB_ASK_FORM, REQ_VALIDATION);

    char * buffRequest = new char[(LINES/2 - 6) * (COLS/4 - 3) + 1];
    
    snprintf(buffRequest, (LINES/2 - 6) * (COLS/4 - 3), "%s", field_buffer(INPUT_FIELD[0], 0));
    
    string tmp = buffRequest;
    delete [] buffRequest;
    
    // Tags search criterion was selected
    if(keyGui == 7){
        request->fillSearchPatterns(tmp);
    }
    // Name or subtext search criterion was selected
    else{
        request->getSubTextPattern(tmp);
    }
    
    // Free memory:
    unpost_form(NB_ASK_FORM);
    free_form(NB_ASK_FORM);
    free_field(INPUT_FIELD[0]);
    delwin(NB_ASK_WIN);
    hide_panel(m_Panel);
    initSelect();
    
    return 10;
}
//---------------------------------------------------------------------------------------

