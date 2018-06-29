#ifndef NB_WINDOW_H
#define NB_WINDOW_H

#include "EditWindowTextNote.h"
#include "EditWindowTaskList.h"
#include "EditWindowShopList.h"


//---------------------------------------------------------------------------------------
/*! \class Window
 \brief Class is for interfacing with user.
 Appliaction during running have only two instance of this class.
 First one represents main selection menu window located in left upper corner and
 allows to choose operation to execute.
 Second one represents window located in left lower corner and allows to choose
 create/searching option or inicialize input field to save user
 input criterion for searching/filtration.
 It needs to interact with appliaction.
 Almost all methods of this class have as a parametr instance of EditWindow class.
 Window of this instance will be drawing after each changing in menu bar.
 One attribute( pointer ) of class is not private because it is shared and cannot affect to instance.
 NCurses Panel object allows to associate application data with a panels panel.
 Class Window cannot change anything in filesystem.
 Window design is based on Ncurses libraries.
 */
class Window
{
public:
                    Window( int h, int w, int x, int y );
                    ~Window( void );
    void            printItems( void )const;
    void            printSelect( const string* array )const;
    void            initLeft( void );
    void            initSelect( void );
/*! \fn Window::getSearchPattern( CSearchRequest* request, int keyGui )
 \param[in] request represents searching criterions and result list of notes in current session last request.
 \param[in] keyGui signalize if user select in searching menu "All Notes" option. Dont need to fill CSearchRequest instance.
 \brief Function inicialize ncurses fields for user input. Using to set searching criterions
 that will be saved to CSearchRequest instance. Based on results instance of EditWindow will print result list.
 */
    int             getSearchPattern( CSearchRequest* request, int keyGui );
/*! \fn Window::menuInterfase( EditWindow& dst )
 \param[in] dst instance of EditWindow class. Using for displaying window in right part of terminal window.
 \brief Function represents menu bar window that allows to choose what kind of operation to execute
 */
    int             menuInterfase( EditWindow& dst );
/*! \fn Window::selectInterfase( EditWindow& dst )
 \param[in] dst instance of EditWindow class. Using for displaying window in right part of terminal window.
 \brief Function represents menu select window that allows to choose criterion of searching
 */
    int             selectInterfase( EditWindow& dst );
/*! \fn Window::createInterface( EditWindow& dst )
 \param[in] dst instance of EditWindow class. Using for displaying window in right part of terminal window.
 \brief Function represents menu select window that allows to choose type of note to create.
 */
    int             createInterface( EditWindow& dst );

    PANEL*                          m_Panel;
protected:
    WINDOW*                         m_Win;
    int                             m_SelPos;
};
//---------------------------------------------------------------------------------------


#endif /* NB_WINDOW_H */

