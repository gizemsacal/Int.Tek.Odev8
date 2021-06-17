$(document).ready(function(){
    var i; // Anlık soru indexini tutan değişken
    var quiz=[]; // Soruların şıkların ve cevapların tutulduğu değişken
    var Count;  // Geri sayım değişkeni
    var imageChoice; // Görsellerin tutulacağı değişken
    var correct=0; // Doğru cevap sayısının tutulacağı değişken
    var missed =0; // Yanlış cevap sayısının tutulacağı değişken
    var attempted = 0; // İşaretlenilen soru sayısını tutan değişken
    var intervalTimer;
    var delayButtonAlert;
    var newQuest;
    var ansAttempt; // Soru süre içerisinde işaretlendi mi kontrolü

    temizle();
    quizBuild(); //Sorular, seçenekleri, cevapları, resimleri, videoları hepsi burada dizi aracılığı ile tanımlanır.

    i = 1;

    hideStuff(); // Gizlenecek alanların belirlendiği fonksiyon

    $("#new-question").on("click",displayNewQuestion); // Oyunu başlat butonuna tıklanıldığında displayNewQuestion fonksiyonunun çalışması
    $("#new-question").on("click",displayStats); // Oyunu başlat butonuna tıklanıldığında displayStats fonksiyonunun çalışması
    $("#new-question").on("click",imageInsert); // Oyunu başlat butonuna tıklanıldığında imageInsert fonksiyonunun çalışması

function temizle() { // deneme div'inin içerisini temizlemek için hidden yapılarak gizlendi
    document.getElementById("deneme").style.visibility = "hidden";
    //document.getElementById("div1").style.visibility = "hidden"; //Sonuç alanının temizlenmesi için yazılabilir
}
    function displayNewQuestion(){ // Yeni soruyu görüntüleyen fonksiyon

        document.getElementById("deneme").style.visibility = "visible"; // deneme div'inin görünür olması

        if (i > 0) { // Her soru geçişinde
            clearTimeout(newQuest);  // Zamanlayıcının sıfırlanması
        }

        $("#new-question").hide(); // Önceki sorunun gizlenmesi
        videoInsert(); // Soru videosunun yüklenmesi
        imageInsert(); // Soru görselinin yüklenmesi
        hideStuff(); // Gizlenecek alanların belirlendiği fonksiyon


        ansAttempt = false; // Soru henüz işaretlenmediği için false
        quizWrite(); // Sorunun ekrana basıldığı fonksiyon

        Count = 10; // Geri sayımın belirlendiği değişken
        intervalTimer = setInterval(countDown,1000); // Her saniye başı zamanlayıcının azalması

        delayButtonAlert = setTimeout(notAttempted,10000); // Cevap verilmediği sürece 10 saniye sonra bir sonraki soruya geçmek için
        clearButton(); // Butonların default renk aldığı fonksiyon


    }

    $(document).on("click",".answer",Attempted); // Şıklardan herhangi birine tıklanıldığı taktirde Attempted fonksiyonu


    // Sayaç bu fonksiyon aracılığı ile azalır.
    function countDown(){
        Count -= 1;
        $("#seconds-count").html('<h3> '+ Count + " saniyen kaldı </h3> ")
        return Count;
    }

    function hideStuff(){

        //$(".stats").hide();
        $("#message").hide(); // Doğru / Yanlış cevap verdin metninin bulunduğu div'i gizle
        $("#picture").hide(); // Soru görsellerinin/videolarının bulunduğu div'i gizle
        $("#Reveal").hide(); // Doğru cevabın gösterildiği div'i gizle
    }


    //Cevapların doğru veya yanlış olduğunu kontrol eden fonksiyon
    function Attempted(){

        clearTimeout(delayButtonAlert);
        clearTimeout(intervalTimer); // Zamanlayıcılar sıfırlanır


        ansAttempt = true; // Soru işaretlendiği için true
        $("#message").show(); // Doğru / yanlış cevap verdin metinlerinin basıldığı div'in gösterilmesi

        userChoice = parseInt($(this).val()); // Tıklanılan string'in integer'a dönüştürülmesi ( 1 2 3 4 )
        console.log(userChoice, i);

        attempted += 1; // İşaretlenen soru sayısının 1 artması

        if (userChoice === quiz[i].ans){ // Eğer doğru şık seçilmiş ise

            $("#message").html('Doğru Cevap verdin!');
            correct += 1; // Doğru sayısının 1 artırılması
        }
        else { // Yanlış şık seçilmiş ise
            $("#message").html('Yanlış Cevap verdin !');
            missed += 1; // Yanlış sayısının 1 artırılması
        }

        $(".stats").show(); // Durumun güncellenmesi
        displayStats();

        displayAnsImg(); // Bir sonraki soruya geçen fonksiyon
    }

    //Eğer belirtilen sürede cevap verilmemiş ise süre sonunda yanlış olarak sayılır yeni soruya geçer.
    function notAttempted(){

        if (ansAttempt !== true){ // Eğer herhangi bir cevaba tıklanılmadıysa

            clearTimeout(delayButtonAlert);
            clearTimeout(intervalTimer);  // Zamanlayıcıyı temizleme

            missed +=1; // Yanlış soru sayısının 1 artırılması

            $(".stats").show(); // Durumların güncellenmesi
            displayStats();

            displayAnsImg(); // Doğru cevabın gösterildiği fonksiyon
        }
        else {
            return
        }
    }

    // Bir soruya cevap verildikten 2 saniye sonra yeni soruyu ekrana bastırır.
    function displayAnsImg(){

        if (i < quiz.length){ // Eğer sorular bitmediyse

            newQuest = setTimeout(displayNewQuestion,2000); // 2 saniye bekle
            $("video").remove(); // Videoyu kaldır

        }

        imageChoice = imageInsert(); // Videolu sorulardan bir sonraki soruya geçerken bir önceki sorunun görselinin gelmemesi için
        $("#picture").html(imageChoice);
        $("#Reveal").html("Doğru Cevap: " + quizAnswer()); // Sorunun doğru cevabını göstermek

        $("#picture").show();
        $("#Reveal").show();

        i++;
    }

    //Sorular için constructor
    function quizConstructor(question,choice1,choice2,choice3,choice4,ans,imageURL,attempted, videoURL){
        this.question = question;
        this.choice1   = choice1;
        this.choice2   = choice2;
        this.choice3   = choice3;
        this.choice4   = choice4;
        this.ans       = ans;
        this.imageURL  = imageURL;
        this.attempted = attempted;
        this.videoURL  = videoURL;
    }

    //Sorular, seçenekleri, cevapları, resimleri, videoları hepsi burada dizi aracılığı ile tanımlanır.
    function quizBuild(){
        quiz[1] = new quizConstructor('Dünyaca ünlü futbolcu Ronaldo hangi sağlıklı yaşam markasının yüzü olmuştur ','HerbaLife',' ','FitWell','SyNevo',1,"files/herbalife.jpg",false);
        quiz[2] = new quizConstructor('Videodaki dizinin adı nedir ','Dark','HIMYM','FRIENDS','Game Of Thrones',3,"",false,"files/friends.mp4");
        quiz[3] = new quizConstructor('Görselde bulunan Çeşnigir Köprüsü hangi ilimizdedir ','Kırklareli','Kırıkkale','Sivas','Elazığ',2,"files/cesnigir.jpg",false);
        quiz[4] = new quizConstructor('Videoda yer alan Sezen Aksu şarkısı hangisidir ','Ben Kedim Yatağım','Kendimce','İhanetten Geri Kalan','Aşktan Ne Haber',4,"",false,"files/sezen.mp4");
        quiz[5] = new quizConstructor();
        return quiz
    }

    //Her cevap verilen soru sonunda buton renkleri default hale döndürülür.
    function clearButton(){
        $("#option-1").css("background-color","bisque");
        $("#option-2").css("background-color","bisque");
        $("#option-3").css("background-color","bisque");
        $("#option-4").css("background-color","bisque");
    }

    // Soruları ekrana basar.
    function quizWrite(){
        $("#question").html("" + quiz[i].question + " ?"); // Soruyu ve sonuna ? işaretini basar

        console.log(quiz[i].videoURL);
        if(quiz[i].videoURL==null){ // Eğer soru videolu bir soru değil ise ( Resimli görsel ise )
            imageChoice = imageInsert(); // Sorunun görselini ekler
            $("#picture").show(); // Ve görseli görünür yapar
            $("#picture").html(imageChoice); // Dönen görseli picture elementinin içine basar
        }
        else{ // Eğer soru videolu bir soru ise
            imageChoice = videoInsert(); // Sorunun videosunu ekler
            $("#video").show(); // Videoyu görünür yapar
            $("#video").html(imageChoice); // Videoyu video div'inin içine basar
        }

    // Dizinin 6. elemanında soru olmadığı için 5. indise geldiğinde ekran temizlenir ve oyun durur.
        if(i===5)
        {
            var x = document.getElementById("deneme");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }

            var x = document.getElementById("seconds-count");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
            alert("Oyun Bitti!\n"+"Doğru Sayısı: "+correct+"\nYanlış Sayısı: "+missed);

        }
        // Eğer dizinin 5. elemanında değil ise şıkları basar
        $("#option-1").html(quiz[i].choice1);
        $("#option-2").html(quiz[i].choice2);
        $("#option-3").html(quiz[i].choice3);
        $("#option-4").html(quiz[i].choice4);

    }

    // Cevap kısmında value değerleri ile seçim eşleşmeleri
    function quizAnswer(){
        if (quiz[i].ans === 1){
            quizAns = quiz[i].choice1;
        }else if (quiz[i].ans === 2){
            quizAns = quiz[i].choice2;
        }else if (quiz[i].ans === 3){
            quizAns = quiz[i].choice3;
        }if (quiz[i].ans === 4){
            quizAns = quiz[i].choice4;
        }

        // Eğer cevap 1. seçenek ise onu yeşil yap gerisini kırmızı yap
        if(1===quiz[i].ans){
            $("#option-1").css("background-color","green");
            $("#option-2").css("background-color","red");
            $("#option-3").css("background-color","red");
            $("#option-4").css("background-color","red");
        }

        // Eğer cevap 2. seçenek ise onu yeşil yap gerisini kırmızı yap

        if(2===quiz[i].ans){
            $("#option-1").css("background-color","red");
            $("#option-2").css("background-color","green");
            $("#option-3").css("background-color","red");
            $("#option-4").css("background-color","red");
        }

        // Eğer cevap 3. seçenek ise onu yeşil yap gerisini kırmızı yap
        if(3===quiz[i].ans){
            $("#option-1").css("background-color","red");
            $("#option-2").css("background-color","red");
            $("#option-3").css("background-color","green");
            $("#option-4").css("background-color","red");
        }

        // Eğer cevap 4. seçenek ise onu yeşil yap gerisini kırmızı yap
        if(4===quiz[i].ans){
            $("#option-1").css("background-color","red");
            $("#option-2").css("background-color","red");
            $("#option-3").css("background-color","red");
            $("#option-4").css("background-color","green");
        }

        return quizAns;
    }

    //Ekrana Doğru sayısını, yanlış sayısını ve deneme sayısını yazdır.
    function displayStats(){
        $(".stats").html("<h4> Doğru Sayısı: "+correct+'<br>'+"Yanlış Sayısı: " + missed + '<br>' +"Deneme Sayısı: " +attempted+'<br>'+"Puan: "+correct +'/'+i+ '</h4>');
    }

    //Resim ekleme fonksiyonu
    function imageInsert(){
        var imageChoice = $('<img>');
        imageChoice.attr('src', quiz[i].imageURL); // İlgili dizi içerisinde yer alan görsel yolunu 800 px genişliğinde dönder
        imageChoice.attr('width','800px');
        return imageChoice;
    }

    //Video ekleme fonksiyonu
    function videoInsert(){
        var imageChoice = $('<video>');
        imageChoice.attr("controls","controls"); // Videonun durdurulabilmesi için gerekli
        imageChoice.html('<source src='+ quiz[i].videoURL +' type=\'video/mp4\'>');
        imageChoice.attr('width','800px'); // İlgili dizi içerisinde yer alan video yolunu 800 px genişliğinde dönder
        return imageChoice;
    }
})