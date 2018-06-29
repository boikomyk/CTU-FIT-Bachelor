#include "GUI.h"


int main(void){
    CDatabase db;
    db.createDefaultTables();
    
    GUI::GUIMode(db);
    
    

    return 0;
}


