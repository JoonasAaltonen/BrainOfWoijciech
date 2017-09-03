

function ProcessMessage()
{
    var message = document.getElementById("MessageBox").value.toLowerCase();

    var answer = String.concat(message, "wat");     // USE THIS FOR TRHE ANSWER CONCATS!!
    document.getElementById("Answer").value = answer;
    if (message === "")
    {
        document.getElementById("Answer").value = "Mind stop asking me nothing?";
        return false;
    }
    else if (message.search("food") >= 0)
    {
        document.getElementById("Answer").value = "We don't have food, go home -_-";
    }
    else if (message.search("party") >= 0)
    {
        document.getElementById("Answer").value = "PARTY HARD MOTHERFUCKER";
    }
    else
    {
        document.getElementById("Answer").value = "Hello there!";
        return true;
    }
}