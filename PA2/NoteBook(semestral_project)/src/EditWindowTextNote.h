#ifndef NB_EDITWINDOWTEXTNOTE_H
#define NB_EDITWINDOWTEXTNOTE_H

#include "EditWindow.h"

//---------------------------------------------------------------------------------------
/*! \class EditWindowTextNote
 \brief Class is for interfacing with user.
 Every instance of the class represents a single note of ordinary text type.
 It needs for making different CRUD operation on notes: creating, showing, editing etc.
 Class EditWindowTextNote cannot change anything in filesystem.
 Window design is based on Ncurses libraries.
 */
class EditWindowTextNote : public EditWindow
{
public:
                            EditWindowTextNote( int h, int w, int x, int y );
    virtual                 ~EditWindowTextNote( void );
    virtual void            initEditField( int lines, int colm );
    virtual int             createNote( CSQLManager* mn );
    virtual void            closeInputAndFree( void )const;
    virtual int             showNote( CSQLManager* mn, CSearchRequest* rq );
    virtual void            updateFieldsAfterNotice( const int limit, const int curInd, const int curPos );

};
//---------------------------------------------------------------------------------------

#endif /* NB_EDITWINDOWTEXTNOTE_H */
