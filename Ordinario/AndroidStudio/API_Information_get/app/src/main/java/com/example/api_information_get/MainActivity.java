package com.example.api_information_get;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;
public class MainActivity extends AppCompatActivity {


    TextView data;

    Button btn;
    String url;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        data=(TextView) findViewById(R.id.texto);
        btn=findViewById(R.id.button2);
        url="https://worldtimeapi.org/api/timezone/Asia/Kolkata";
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    String datetime=response.getString("datetime");
                    data.setText(datetime);
                }catch(Exception e){}
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError volleyError) {

            }
        });
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v){
                JsonObjectRequest request = new JsonObjectRequest(
                        Request.Method.GET,
                        url,
                        null,
                        response -> {
                            try {
                                String datetime = response.getString("datetime");
                                data.setText(datetime);
                            } catch (Exception e) {
                                data.setText("Error al procesar respuesta");
                            }
                        },
                        error -> data.setText("Error: " + error.getMessage())
                );

                Volley.newRequestQueue(v.getContext()).add(request);
            }
        });

    }
}

//        Volley.newRequestQueue(this).add(request);