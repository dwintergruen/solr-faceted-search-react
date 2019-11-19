Um den Viewer in DJANO einzubauen:

1) "build" the package with NPM
2) copy the "build" folder into djangocms-GMPG_search/static/GMPG_search2/
3) move or copy index.html aus build/static zu templates/gmpg_search
4) Search in index.html for **\<body\>{% block content %}**
5) Somewhere short after this you will find {% endblock %} 
6) Delete this and paste it at the end of index.html before \</body\>
7) The end if index.html should look like **\</script\>{% endblock %}\</body\>\</html\>**