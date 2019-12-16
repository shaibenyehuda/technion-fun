jb.ns('technion-fun')

jb.component('technion-fun.main', { 
  type: 'control',
  impl: group({
    layout: layout.vertical(),
    controls: [
      group({
        title: 'details',
        layout: layout.horizontal('10'),
        controls: [
          editableText({title: 'ID', databind: '%$tech/ID%'}),
          editableText({title: 'exercise', databind: '%$tech/Hwn%'}),
          editableText({title: 'question', databind: '%$tech/Ques%'})
        ]
      }),
      button({
        title: 'check',
        action: writeValue(
          '%$tech/result%',
          pipe(
            http.fetch({
                url: 'http://csm.cs.technion.ac.il/~cs234114/',
                method: 'POST',
                headers: obj(
                  prop('Accept', 'text/html'),
                  prop(
                      'Content-Type',
                      'multipart/form-data; boundary=---------------------------18467633426500'
                    )
                ),
                body: `-----------------------------18467633426500
Content-Disposition: form-data; name="ID"

%$tech/ID%
-----------------------------18467633426500
Content-Disposition: form-data; name="Hwn"

%$tech/Hwn%
-----------------------------18467633426500
Content-Disposition: form-data; name="Ques"

%$tech/Ques%
-----------------------------18467633426500
Content-Disposition: form-data; name="MAX_FILE_SIZE"

80480
-----------------------------18467633426500
Content-Disposition: form-data; name="hw"; filename="hw%$tech/Hwn%q%$tech/Ques%.c"
Content-Type: text/plain

%$tech/program%
-----------------------------18467633426500
Content-Disposition: form-data; name="submit"

שלח
-----------------------------18467633426500--`,
                useProxy: 'cloud'
              }),
              technionFun.resultParser(),
            first()
          )
        )
      }),
      group({
        title: 'program',
        style: propertySheet.titlesAbove({}),
        controls: [
          editableText({
            title: 'program',
            databind: '%$tech/program%',
            style: editableText.textarea('20')
          }),
          html({
            title: 'result',
            html: '%$tech/result%',
            features: [css.width('500'), watchRef({ref: '%$tech/result%', strongRefresh: 'true'})]
          })
        ]
      })
    ]
  })
})

jb.component('data-resource.tech', { /* dataResource.tech */
  watchableData: {
    ID: '212172027',
    Hwn: '1',
    Ques: '1',
    program: `function main() {
   printf("Hello, World!");
}`,
    result: [
      `

<hr />


 שלום 212172027 להלן הפלט לתרגיל בית 1 שאלה מספר 1
<br />ארעה שגיאת קומפילצייה בתרגיל שלך <br />פירוט של השגיאה:<br />	<textarea dir="ltr" style="width:800px;height:120px">
	hw1q1.c:1:1: error: unknown type name 'function'
{
^
hw1q1.c: In function 'main':
hw1q1.c:2:4: error: implicit declaration of function 'printf' [-Werror=implicit-function-declaration]
;
^
hw1q1.c:2:4: error: incompatible implicit declaration of built-in function 'printf' [-Werror]
s

		</textarea>
`
    ]
  }
})

jb.component('technion-fun.result-parser', { /* technionFun.resultParser */
  type: 'data',
  impl: pipeline(
    split({separator: '</form>', part: 'last'}),
    split({separator: '</body>', part: 'first'})
  ),
  testData: "<!DOCTYPE html> <!-- Dmitry Rabinovich March 2018 --> <html lang=\"he\"> <head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /> <title>קורס 234114/7</title>  <style type=\"text/css\"> .r { \ttext-align: right; \tdirection:rtl; }  .meta { \tposition: relative; \ttop: -20px; }   </style>  <script> \tfunction updateQuestionsAvailable() \t{ \t\tvar hwkOptions = document.getElementById(\"Hwn\"); \t\tvar availableQuestions = hwkOptions.selectedOptions[0].attributes[\"data-available-questions\"]; \t\t//enable questions which should be enabled \t\tvar questionOptions = document.getElementById(\"Ques\").getElementsByTagName(\"option\"); \t\tfor (var i = 1; i < questionOptions.length; i++)  \t\t{ \t\t\tnewValue = (parseInt(questionOptions[i].value) > parseInt(availableQuestions.value)); \t\t\tquestionOptions[i].disabled = newValue; \t\t} \t} </script>  </head>  <body class=\"r\" style=\"padding-left: 2em; padding-right: 2em;\">  <h1>מבוא למדעי המחשב מ' + ח' 234114/7<br> אתר לבדיקת עצמית של תרגילי הבית</h1>  <p class=\"r\" dir=\"rtl\"> <p class=\"meta\"> גרסת בטא 1.5.114 </p>  שלום לסטודנטים <abbr title=\"234114/7\">בקורס מבוא למדעי המחשב 234114/7 - בטכניון</abbr> <br> <br> אתר זה נפתח בכדי לעזור לכם לבדוק את תרגילי הבית לפני ההגשה. <br> לפני שאתם ניגשים להשתמש באתר, אנא בידקו את התוכנית שלכם עם הדוגמאות שנתנו לכם (אשר הם חלק מהטסטים!). <br> במיוחד, וודאו שהפלט שלכם מתאים ב-100% לפלט שנתנו לכם. תיעזרו במשימה זאת בתוכנת DIFFMERGE. <br> אם נפלתם בטסטים מסויימים, סביר להניח ששכחתם לחשוב על משהו, או כי יש לכם טעות בקוד. <br> <br> <b> לידיעתכם, חלק מהטסטים ישמשו לבדיקה הסופית שתקבע את ציונכם. צוות הקורס שומר לעצמו את הזכות להוספה והורדה של טסטים. </b> <br> <br> <b> שימו לב! אתר זה אינו משמש להגשת תרגילי הבית. </b> <br> את התרגיל יש להגיש ב <a taregt=\"_blank\" href=\"http://webcourse.cs.technion.ac.il/234114\">אתר הקורס</a> בעמוד assignments. <br> הפתרון שייבדק ולפיו ייקבע ציונכם, הוא הפתרון שהגשתם דרךאתר הקורס. <br> <br> האתר הינו בגרסה ראשונית ולכן הוא עלול לעבוד באופן בלתי צפוי. <br> במידה ויש בעיה באתר, אנא עיינו ב <a href=\"http://webcourse.cs.technion.ac.il/234114/Winter2015-2016/en/faq_AutomaticChecker.html\">(F.A.Q.)</a> <!--br>  יש לצרף למייל את הקובץ שהעלתם בשביל הבדיקה ותמונת מסך לאתר אחרי השגיאה. צילום מסך עושים ע\"י לחיצה על CTRL+ALT+PrtScr <a href=\"http://www.tapuz.co.il/Forums2008/Articles/Article.aspx?ForumId=500&aId=67033\">(למידע נוסף על צילום מסך)</a> <br--> לידיעתכם, אם תוכניתכם אינה עוברת קומפילציה או נכשלת בטסטים מסויימים, זה אומר כי יש בעיה בפתרון שלכם ולא באתר <br> <br> <b> שאלות על התרגיל יש להפנות למתרגל האחראי על התרגיל </b> <br> <br> <i> איך להשתמש באתר ? </i> <br> </p>  <ol> <li> יש להזין את תעודת הזהות בטופס המופיע למטה </li> <li> לאחר מכן יש לבחור את מספר תרגיל הבית</li> <li> לאחר מכן יש לבחור את מספר התרגיל שאותו הינכם מעוניינים לבדוק</li> <li> לאחר מכן יש ללחוץ על browse ולבחור את הקובץ c. של התרגיל שלכם</li> <li> לחצו על שלח , והמתינו מספר שניות</li> </ol>   </p>    <form id=\"form1\" enctype=\"multipart/form-data\" class=\"r\" name=\"form1\" method=\"post\" action=\"\"> \t<fieldset> \t<legend class=\"r\" align=\"right\"> <bdo dir=\"rtl\"> אנא הזינו פרטים </bdo></legend> \t<label for=\"ID\">תעודת זהות</label> \t<input name=\"ID\" type=\"text\" id=\"ID\" size=\"15\" maxlength=\"9\" value=\"212172027\" /> \t<p> \t\t<label for=\"Hwn\">תרגיל בית</label> \t\t<select name=\"Hwn\" size=\"1\" id=\"Hwn\" onChange=\"updateQuestionsAvailable()\" value=\"1\"> \t\t\t<option disabled=\"disabled\">הכנס תרגיל בית</option> \t\t\t<option value=\"7\" data-available-questions=\"1\" disabled=\"disabled\">תרגיל 7</option> \t\t\t<option value=\"6\" data-available-questions=\"1\" disabled=\"disabled\">תרגיל 6</option> \t\t\t<option value=\"5\" data-available-questions=\"3\" disabled=\"disabled\">תרגיל 5</option> \t\t\t<option value=\"4\" data-available-questions=\"2\" >תרגיל 4</option> \t\t\t<option value=\"3\" data-available-questions=\"1\" >תרגיל 3</option> \t\t\t<option value=\"2\" data-available-questions=\"3\" >תרגיל 2</option> \t\t\t<option value=\"1\" data-available-questions=\"2\" >תרגיל 1</option> \t\t\t<option value=\"0\" data-available-questions=\"1\" selected=\"selected\">תרגיל 0</option> \t\t</select> \t</p> \t<p> \t\t<label for=\"Ques\">שאלה</label> \t\t<select name=\"Ques\" size=\"1\" id=\"Ques\" value=\"1\"> \t\t\t<option disabled=\"disabled\" selected=\"selected\">הכנס שאלה</option> \t\t\t<option value=\"1\" >שאלה 1</option> \t\t\t<option value=\"2\" disabled=\"disabled\">שאלה 2</option> \t\t\t<option value=\"3\" disabled=\"disabled\">שאלה 3</option> \t\t\t<option value=\"4\" disabled=\"disabled\">שאלה 4</option> \t\t</select> \t</p>  \t<p> \t   \t  <input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"80480\" /> \t  <label for=\"hw\">בחירת קובץ</label> \t  <input name=\"hw\" type=\"file\" id=\"hw\" label=\"בחירת קובץ\"/> \t</p>  \t<p> \t  <input type=\"submit\" name=\"submit\" id=\"submit\" value=\"שלח\"/> \t</p> </fieldset> </form>  <hr />    שלום 212172027 להלן הפלט לתרגיל בית 1 שאלה מספר 1 \t<p dir=\"rtl\" class=\"r\"> \t<br /> \tהקוד שלך התקבל בהצלחה באתר והורץ. מתוך 5 טסטים התקבלו סה\"כ 0 טסטים \t<table border=\"1\"> \t<tr> \t<td> מספר טסט </td> \t<td> תוצאה </td> \t<td> הקלט </td> \t<td> פלט רצוי </td> \t<td> פלט </td> \t</tr> \t\t\t<tr> \t\t<td> טסט 1 </td> \t\t<td> לא עבר\t\t</td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1in1.txt\">link</a></td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1out1.txt\">link</a></td>  \t\t<td> \t\t<a href='failed_tests/hw1q1.out1.212172027.txt'>link</a>\t\t</td>  \t\t</tr> \t\t\t<tr> \t\t<td> טסט 2 </td> \t\t<td> לא עבר\t\t</td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1in2.txt\">link</a></td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1out2.txt\">link</a></td>  \t\t<td> \t\t<a href='failed_tests/hw1q1.out2.212172027.txt'>link</a>\t\t</td>  \t\t</tr> \t\t\t<tr> \t\t<td> טסט 3 </td> \t\t<td> לא עבר\t\t</td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1in3.txt\">link</a></td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1out3.txt\">link</a></td>  \t\t<td> \t\t<a href='failed_tests/hw1q1.out3.212172027.txt'>link</a>\t\t</td>  \t\t</tr> \t\t\t<tr> \t\t<td> טסט 4 </td> \t\t<td> לא עבר\t\t</td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1in4.txt\">link</a></td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1out4.txt\">link</a></td>  \t\t<td> \t\t<a href='failed_tests/hw1q1.out4.212172027.txt'>link</a>\t\t</td>  \t\t</tr> \t\t\t<tr> \t\t<td> טסט 5 </td> \t\t<td> לא עבר\t\t</td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1in5.txt\">link</a></td> \t\t\t\t<td><a href=\"tests/hw1/hw1q1out5.txt\">link</a></td>  \t\t<td> \t\t<a href='failed_tests/hw1q1.out5.212172027.txt'>link</a>\t\t</td>  \t\t</tr> \t\t</table> \t<br /> \tטסט שנתקע הינו טסט התקוע בלולאה אינסופית או ממתין לקלט. \t<br /> \tטסט שקרס הינו לרוב טסט שפנה לכתובת לא חוקית. (יש לוודא ידנית שכל פניה למערך או לפויינטר פונה אך ורק לזכרון חוקי שהוגדר כנדרש). \t<br /> \t</p>  </body> </html>"
})
