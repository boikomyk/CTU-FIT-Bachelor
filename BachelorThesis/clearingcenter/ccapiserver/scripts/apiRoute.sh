#!/bin/bash
php ./../bin/console debug:route | tail -n +16 >> tmp.txt
echo -e "API_ROUTES: "
echo -e "-----------------------------------------------"
awk '
{
    for(i=1; i<=NF; i++) 
    {
    	if (i == 1)
		{
	    	nameOfApiRoute=$i
		}
        if (i == 2)
        {
            methodType=$i
        }
        if ( $i ~ /.*api.*/ ) 
        {
        	counter++
                if (counter >= 10)
                    space=" "
                else
                    space="  " 
            print counter ")" space  "NAME   : " nameOfApiRoute 
            print "    METHOD : " methodType
			print "    PATH   : " $i
            print "-----------------------------------------------"
        }

    }
}' tmp.txt
rm -rf tmp.txt
