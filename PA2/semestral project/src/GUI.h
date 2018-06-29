#ifndef NB_GUI_H
#define NB_GUI_H

#include "Window.h"

//---------------------------------------------------------------------------------------
/*! \class GUI
 \brief Class GUI represents GUI. Dont need to create instance of this class.
 Methods are called only once during executing the programm.
 */
class GUI{
public:
/*! \fn Window::createTitle( WINDOW* title[2] )
 \param[in] title array of two ncurses WIDNOW objects.
 \brief Function initialize main menu bar containing helper keys and other names.
 */
    static void createTitle( WINDOW* title[2] );
/*! \fn Window::GUIMode( CDatabase& db )
 \param[in] db instance of Database class. Using to connect graphical part of application with external database.
 \brief Function inicializes ncurses library and all curses data structures. Create instance of all windows classes.
 Provides connection between all programm parts.
 */
    static void GUIMode( CDatabase& db );
private:
    GUI() = default;
};
//---------------------------------------------------------------------------------------

#endif /* NB_GUI_H */
