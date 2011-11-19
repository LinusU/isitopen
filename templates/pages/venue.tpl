
<header>
    <a href="/" class="left">Home</a>
    <h1>{$venue}</h1>
</header>

<article>
    
    <table style="width: 100%; padding: 12px;">
        <tr><th colspan="2">Öppetider</th></tr>
        <tr><td>Måndag </td><td style="text-align: right;">{$hours[0]|default:"Stängt"}</td></tr>
        <tr><td>Tisdag </td><td style="text-align: right;">{$hours[1]|default:"Stängt"}</td></tr>
        <tr><td>Onsdag </td><td style="text-align: right;">{$hours[2]|default:"Stängt"}</td></tr>
        <tr><td>Torsdag</td><td style="text-align: right;">{$hours[3]|default:"Stängt"}</td></tr>
        <tr><td>Fredag </td><td style="text-align: right;">{$hours[4]|default:"Stängt"}</td></tr>
        <tr><td>Lördag </td><td style="text-align: right;">{$hours[5]|default:"Stängt"}</td></tr>
        <tr><td>Söndag </td><td style="text-align: right;">{$hours[6]|default:"Stängt"}</td></tr>
    </table>
    
</article>
