#ifndef NB_EDITWINDOWSHOPLIST_H
#define NB_EDITWINDOWSHOPLIST_H


#include "EditWindow.h"


//---------------------------------------------------------------------------------------
/*! \class EditWindowShopList
 \brief Class is for interfacing with user.
 Every instance of the class represents a single note of shop list type.
 It needs for making different CRUD operation on notes: creating, showing, editing etc.
 Class EditWindowTextNote cannot change anything in filesystem.
 Window design is based on Ncurses libraries.
 */
class EditWindowShopList : public EditWindow
{
public:
                            EditWindowShopList( int h, int w, int x, int y );
    virtual                 ~EditWindowShopList( void );
    virtual void            initEditField( int lines, int colm );
    virtual int             createNote( CSQLManager* mn );
    virtual void            closeInputAndFree( void )const;
    virtual int             showNote( CSQLManager* mn, CSearchRequest* rq );
    virtual void            updateFieldsAfterNotice( const int limit, const int curInd, const int curPos );
};
//---------------------------------------------------------------------------------------

#endif /* NB_EDITWINDOWSHOPLIST_H */
