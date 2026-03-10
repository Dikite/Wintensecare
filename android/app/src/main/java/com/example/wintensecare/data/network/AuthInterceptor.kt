package com.example.wintensecare.data.network

import android.content.Context
import com.example.wintensecare.data.datastore.TokenStore
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(
    private val context: Context
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val tokenStore = TokenStore(context)

        val token = runBlocking {
            tokenStore.getTokenOnce()
        }

        val requestBuilder = chain.request().newBuilder()

        if (!token.isNullOrEmpty()) {
            requestBuilder.addHeader(
                "Authorization",
                "Bearer $token"
            )
        }

        return chain.proceed(requestBuilder.build())
    }
}
