import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { dbQuery, useVercelPostgres } from '../../../lib/db';

// API endpoint для загрузки файлов в Supabase Storage
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const appealId = formData.get('appealId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не предоставлен' },
        { status: 400 }
      );
    }

    if (!appealId) {
      return NextResponse.json(
        { error: 'ID обращения не предоставлен' },
        { status: 400 }
      );
    }

    // Проверка размера файла (10MB максимум)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 10MB' },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${appealId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Конвертируем File в ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Загружаем в Supabase Storage
    // ВАЖНО: Нужно создать bucket 'appeal-attachments' в Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('appeal-attachments')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Ошибка загрузки файла:', uploadError);
      return NextResponse.json(
        { error: 'Не удалось загрузить файл: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Получаем публичный URL файла
    const { data: urlData } = supabase.storage
      .from('appeal-attachments')
      .getPublicUrl(fileName);

    // Сохраняем информацию о файле в БД
    let attachmentData: any = null;
    let dbError: any = null;
    if (useVercelPostgres) {
      try {
        const res = await dbQuery<{
          id: string;
          appeal_id: string;
          file_name: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          uploaded_at: string;
        }>`
          insert into appeal_attachments (appeal_id, file_name, file_url, file_size, mime_type)
          values (${appealId}::uuid, ${file.name}, ${urlData.publicUrl}, ${file.size}, ${file.type})
          returning *
        `;
        attachmentData = res.rows[0];
      } catch (error: any) {
        dbError = error;
      }
    } else {
      const inserted = await supabase
        .from('appeal_attachments')
        .insert({
          appeal_id: appealId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();
      attachmentData = inserted.data;
      dbError = inserted.error;
    }

    if (dbError) {
      console.error('Ошибка сохранения в БД:', dbError);
      // Пытаемся удалить загруженный файл
      await supabase.storage.from('appeal-attachments').remove([fileName]);
      return NextResponse.json(
        { error: 'Не удалось сохранить информацию о файле' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attachment: attachmentData,
      url: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Ошибка загрузки файла:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}

