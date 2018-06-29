#include "GUI.h"

const string titleMain[2] =
{
    "NOTEPAD APPLICATION", "F9 Exit",
};
//---------------------------------------------------------------------------------------

void  GUI::createTitle(WINDOW* title[2]){
    int pos = 2;
    
    for( size_t i = 0; i < 2;i++)
    {
        title[i] = newwin(1, (int)titleMain[i].size() ,1,pos);
        mvwprintw( title[i],0,0, titleMain[i].c_str());
        if(i != 0)
            mvwchgat( title[i], 0, 0, 2, A_NORMAL, 1, NULL );
        pos += (int)titleMain[i].size() + 2;
        refresh();
        wrefresh(title[i]);
        
        pos+= (COLS - (int)titleMain[1].size() - 25);
    }
}
//---------------------------------------------------------------------------------------
/*! \fn Window::redefWindow(PANEL * top, Window * Left, Window * LeftAdditional, int optInd )
 \param[in] top instance of Panel curses class. Represents op of the stack (causes it to be displayed above any other panel).
 \param[in] Left instance Window class. Represents main select menu.
 \param[in] LeftAdditional instance Window class. Represents search/create select menu.
 \param[in] optInd returned value of different methods defines type of note and EditWindow derived sublclass.
 \return pointer to newly created EditWindow derived class
 \brief Function will create instance of EditWindows derived class based on optInd and reassociate
 arbitrary user data with a panel. Using to select type of note to create/dispaly.
 */
EditWindow* redefWindow(PANEL * top, Window * Left, Window * LeftAdditional, int optInd ){
    EditWindow* Right = nullptr;
    if(optInd == 4 || optInd == 12) // TextNote
        Right = new EditWindowTextNote( LINES - 3 , COLS*3/4 - 2, 2, COLS/4 + 1);
    if(optInd == 5 || optInd == 13)
        Right = new EditWindowTaskList( LINES - 3 , COLS*3/4 - 2, 2, COLS/4 + 1);
    if(optInd == 6 || optInd == 14)
        Right = new EditWindowShopList( LINES - 3 , COLS*3/4 - 2, 2, COLS/4 + 1);
    Right->initRight();
 
    if(optInd < 10){
        set_panel_userptr( Left->m_Panel , LeftAdditional->m_Panel);
        set_panel_userptr( LeftAdditional->m_Panel , Right->m_Panel);
        set_panel_userptr( Right->m_Panel , Left->m_Panel);
    }
    else{
        set_panel_userptr( Right->m_Panel , Left->m_Panel);
        set_panel_userptr( Left->m_Panel , LeftAdditional->m_Panel);
        set_panel_userptr( LeftAdditional->m_Panel , Right->m_Panel);
    }

    // set panel of search/create select window as the top of stack
    top = LeftAdditional->m_Panel;
    return Right;
}
//---------------------------------------------------------------------------------------

void GUI::GUIMode(CDatabase & db){
    
    // Create manager and request for actual session:
    CSQLManager * manager = new CSQLManager(&db);
    CSearchRequest * requestMem = new CSearchRequest();
    
    // initialize the ncurses data structures
    initscr();
    start_color();
    init_pair(1, COLOR_BLACK, COLOR_WHITE);
    WINDOW* title[2];
    noecho();
    cbreak();
    keypad( stdscr, TRUE );
    box( stdscr, 0, 0 );
    
    // Create title
    createTitle(title);
    
    // Inicialization of three windows
    Window *Left = new Window ( LINES/2 -1 , COLS/4 - 1, 2, 1 );
    EditWindow *Right = new EditWindowTextNote( LINES - 3 , COLS*3/4 - 2, 2, COLS/4 + 1 );
    Window *LeftAdditional = new Window(LINES/2 - 2, COLS/4 - 1, LINES/2 + 1, 1);
    
    refresh();
    // Concatenate them
    set_panel_userptr( Left->m_Panel , LeftAdditional->m_Panel);
    set_panel_userptr( LeftAdditional->m_Panel , Right->m_Panel);
    set_panel_userptr( Right->m_Panel , Left->m_Panel);
    
    PANEL  * top = Left->m_Panel;
    // Inicialize all windows
    Left->initLeft();
    Right->initRight();
    LeftAdditional->initSelect();
    refresh();
    int key = 0;
    int subKey = 0;
    
    // Begin interaction with user
    while(1)
    {
        if( top == Left->m_Panel )
            key = Left->menuInterfase(*Right);
        if( top == LeftAdditional->m_Panel){
            if(key == 2)
                key = LeftAdditional->createInterface(*Right);
            else if(key == 7 || key == 8 || key == 9 || key == 11)
                key = LeftAdditional->getSearchPattern(requestMem, key);
            else
                key = LeftAdditional->selectInterfase(*Right);
        }
        if( top == Right->m_Panel){
            if(key == 10 || key == 20)
                key = Right->showResultListOfSearch(requestMem, manager, key);
            else if(key == 15)
                key = Right->importNotes(manager, requestMem);
            else if(key > 10)
                key = Right->showNote(manager, requestMem);
            else
                key = Right->createNote(manager);
            Right->initRight();
        }
        switch(key)
        {
            case -1:
                delwin(*title);
                delete Left;
                delete Right;
                delete LeftAdditional;
                delete manager;
                delete requestMem;
                delwin(stdscr);
                endwin();
                return;
            case 0:     // Return to main menu, from selection
                hide_panel(LeftAdditional->m_Panel);
                top = (PANEL *)panel_userptr(top);
                top = (PANEL *)panel_userptr(top);
                top_panel(top);
                break;
            case 1:
            case 2:     // Go to select menu
                top = (PANEL *)panel_userptr(top);
                top_panel(top);
                break;
            case 3:     // Return to main menu, after creating note
                hide_panel(LeftAdditional->m_Panel);
                top = (PANEL *)panel_userptr(top);
                top_panel(top);
                break;
            case 4:     // Create note, from select | TextNote
            case 5:     // Create note, from select | TaskList
            case 6:     // Create note, from select | ShopList
                delete Right;
                Right = redefWindow(top, Left, LeftAdditional, key);
                hide_panel(LeftAdditional->m_Panel);
                top = (PANEL *)panel_userptr(top);
                top_panel(top);
                break;
            case 7:    // By tag
            case 8:    // By name
            case 9:    // By text
            case 11:
                subKey = key;
                break;
            case 10:    // From input "Search By" window to right window to show result search
                if(requestMem->curSessionStatus()){
                    requestMem->prepareResultList(manager, subKey);
                    hide_panel(LeftAdditional->m_Panel);
                    top = (PANEL *)panel_userptr(top);
                    top_panel(top);
                }
                break;
            case 12:    // TextNote show
            case 13:    // TaskList show
            case 14:    // ShopList show
                delete Right;
                Right = redefWindow(top, Left, LeftAdditional, key);
                top = Right->m_Panel;
                top_panel(top);
                break;
            case 15:    // Import menu
                hide_panel(LeftAdditional->m_Panel);
                top = (PANEL *)panel_userptr(top);
                top = (PANEL *)panel_userptr(top);
                top_panel(top);;
            default:
                break;
                
        }
        update_panels();
        doupdate();
    }

    return;
}

